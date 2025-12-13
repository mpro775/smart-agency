import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologiesService } from './technologies.service';
import { TechnologiesController } from './technologies.controller';
import { Technology, TechnologySchema } from './schemas/technology.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Technology.name, schema: TechnologySchema },
    ]),
  ],
  controllers: [TechnologiesController],
  providers: [TechnologiesService],
  exports: [TechnologiesService],
})
export class TechnologiesModule {}

