import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Project, ProjectSchema } from '../projects/schemas/project.schema';
import { Service, ServiceSchema } from '../services/schemas/service.schema';
import { Lead, LeadSchema } from '../leads/schemas/lead.schema';
import { Blog, BlogSchema } from '../blog/schemas/blog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Lead.name, schema: LeadSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
