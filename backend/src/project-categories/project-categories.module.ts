import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectCategoriesController } from './project-categories.controller';
import { ProjectCategoriesService } from './project-categories.service';
import {
  ProjectCategory,
  ProjectCategorySchema,
} from './schemas/project-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectCategory.name, schema: ProjectCategorySchema },
    ]),
  ],
  controllers: [ProjectCategoriesController],
  providers: [ProjectCategoriesService],
  exports: [ProjectCategoriesService],
})
export class ProjectCategoriesModule {}
