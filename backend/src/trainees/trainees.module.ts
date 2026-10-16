import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trainee, TraineeSchema } from './schemas/trainee.schema';
import { TraineesController } from './trainees.controller';
import { TraineesService } from './trainees.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trainee.name, schema: TraineeSchema }]),
  ],
  controllers: [TraineesController],
  providers: [TraineesService],
  exports: [TraineesService, MongooseModule],
})
export class TraineesModule {}
