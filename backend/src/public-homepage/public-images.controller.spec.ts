import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import type { Response } from 'express';
import sharp from 'sharp';
import { PublicImagesController } from './public-images.controller';

describe('Public image derivatives', () => {
  let controller: PublicImagesController;
  const originalFetch = global.fetch;
  const response = () => {
    const headers: Record<string, string> = {};
    const res = {
      req: { headers: {} },
      set: jest.fn((values: Record<string, string>) =>
        Object.assign(headers, values),
      ),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
    return { res, headers };
  };
  beforeEach(() => {
    controller = new PublicImagesController(
      new ConfigService({
        R2_PUBLIC_DOMAIN: 'https://assets.example.com/public',
      }),
    );
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it.each([
    ['123', 'https://assets.example.com/public/photo.webp'],
    ['320', 'http://assets.example.com/public/photo.webp'],
    ['320', 'https://evil.example/public/photo.webp'],
    ['320', 'https://assets.example.com/private/photo.webp'],
    ['320', 'https://user:password@assets.example.com/public/photo.webp'],
    ['320', 'http://127.0.0.1/admin'],
  ])(
    'rejects unsupported width/source without fetching: %s %s',
    async (width, src) => {
      const fetchMock = jest.fn();
      global.fetch = fetchMock;
      await expect(
        controller.image(width, src, response().res as unknown as Response),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it('resizes once, caches the derivative, and returns 304 for its ETag', async () => {
    const input = await sharp({
      create: { width: 800, height: 400, channels: 3, background: '#008080' },
    })
      .png()
      .toBuffer();
    const fetchMock = jest.fn().mockResolvedValue(
      new globalThis.Response(new Uint8Array(input), {
        headers: { 'Content-Type': 'image/png' },
      }),
    );
    global.fetch = fetchMock;
    const first = response();
    await controller.image(
      '320',
      'https://assets.example.com/public/photo.png',
      first.res as unknown as Response,
    );
    const output = first.res.send.mock.calls[0][0] as Buffer;
    expect(first.headers['Cross-Origin-Resource-Policy']).toBe('cross-origin');
    expect(await sharp(output).metadata()).toMatchObject({
      width: 320,
      height: 160,
      format: 'webp',
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({ redirect: 'error' }),
    );
    const second = response();
    (second.res.req.headers as Record<string, string>)['if-none-match'] =
      first.headers.ETag;
    await controller.image(
      '320',
      'https://assets.example.com/public/photo.png',
      second.res as unknown as Response,
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(second.res.status).toHaveBeenCalledWith(304);
    expect(second.res.end).toHaveBeenCalled();
  });
});
