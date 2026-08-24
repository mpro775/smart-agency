import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getConnectionToken } from '@nestjs/mongoose';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getConnectionToken(),
          useValue: { readyState: 1, name: 'smart-agency-test' },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should report a connected database as healthy', () => {
      expect(appController.healthCheck()).toEqual(
        expect.objectContaining({
          status: 'healthy',
          database: {
            status: 'connected',
            name: 'smart-agency-test',
          },
        }),
      );
    });
  });
});
