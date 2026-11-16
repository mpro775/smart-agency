import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Res,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { Public } from '../auth/decorators/public.decorator';

@Controller('public/images')
export class PublicImagesController {
  private readonly cache = new Map<string, { body: Buffer; expires: number }>();
  private cacheBytes = 0;
  constructor(private readonly config: ConfigService) {}

  @Public()
  @Get(':width')
  async image(
    @Param('width') rawWidth: string,
    @Query('src') src: string,
    @Res() response: Response,
  ) {
    const width = Number(rawWidth);
    if (![320, 640, 960, 1280].includes(width))
      throw new BadRequestException('Unsupported image width');
    let url: URL;
    let base: URL;
    try {
      url = new URL(src);
      const domain = this.config.get<string>('R2_PUBLIC_DOMAIN');
      if (!domain) throw new Error('Missing public image domain');
      base = new URL(domain.includes('://') ? domain : `https://${domain}`);
    } catch {
      throw new BadRequestException('Invalid image source');
    }
    // Never fetch arbitrary hosts, credentials, redirects or non-storage paths.
    if (
      url.protocol !== 'https:' ||
      url.origin !== base.origin ||
      url.username ||
      url.password ||
      !url.pathname.startsWith(`${base.pathname.replace(/\/$/, '')}/`)
    ) {
      throw new BadRequestException('Unsupported image source');
    }
    const key = `${width}:${url.href}`;
    let cached = this.cache.get(key);
    if (!cached || cached.expires < Date.now()) {
      let body: Buffer;
      try {
        const upstream = await fetch(url, {
          redirect: 'error',
          signal: AbortSignal.timeout(8000),
        });
        if (
          !upstream.ok ||
          !/^image\/(jpeg|png|webp|avif)(?:;|$)/i.test(
            upstream.headers.get('content-type') ?? '',
          ) ||
          !upstream.body
        )
          throw new Error('Unsupported upstream image');
        const chunks: Uint8Array[] = [];
        let bytes = 0;
        for await (const chunk of upstream.body) {
          bytes += chunk.length;
          if (bytes > 15 * 1024 * 1024) throw new Error('Image exceeds limit');
          chunks.push(chunk);
        }
        body = await sharp(Buffer.concat(chunks), {
          limitInputPixels: 40_000_000,
        })
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
      } catch {
        throw new ServiceUnavailableException(
          'Image transformation unavailable',
        );
      }
      if (cached) {
        this.cacheBytes -= cached.body.length;
        this.cache.delete(key);
      }
      while (
        this.cacheBytes + body.length > 32 * 1024 * 1024 &&
        this.cache.size
      ) {
        const oldestKey = this.cache.keys().next().value!;
        this.cacheBytes -= this.cache.get(oldestKey)!.body.length;
        this.cache.delete(oldestKey);
      }
      cached = { body, expires: Date.now() + 60 * 60 * 1000 };
      this.cache.set(key, cached);
      this.cacheBytes += body.length;
    }
    const etag = `"${createHash('sha256').update(cached.body).digest('hex')}"`;
    response.set({
      'Content-Type': 'image/webp',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      ETag: etag,
    });
    if (response.req.headers['if-none-match'] === etag) {
      response.status(304).end();
      return;
    }
    response.send(cached.body);
  }
}
