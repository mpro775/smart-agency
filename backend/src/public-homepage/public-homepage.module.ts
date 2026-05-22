import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../blog/schemas/blog.schema';
import {
  CompanyInfo,
  CompanyInfoSchema,
} from '../company-info/schemas/company-info.schema';
import { Faq, FaqSchema } from '../faqs/schemas/faq.schema';
import {
  HostingPackage,
  HostingPackageSchema,
} from '../hosting-packages/schemas/hosting-package.schema';
import {
  ProjectCategory,
  ProjectCategorySchema,
} from '../project-categories/schemas/project-category.schema';
import { Project, ProjectSchema } from '../projects/schemas/project.schema';
import { Service, ServiceSchema } from '../services/schemas/service.schema';
import {
  TeamMember,
  TeamMemberSchema,
} from '../team/schemas/team-member.schema';
import {
  Technology,
  TechnologySchema,
} from '../technologies/schemas/technology.schema';
import {
  Testimonial,
  TestimonialSchema,
} from '../testimonials/schemas/testimonial.schema';
import { PublicHomepageController } from './public-homepage.controller';
import { PublicHomepageService } from './public-homepage.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectCategory.name, schema: ProjectCategorySchema },
      { name: Technology.name, schema: TechnologySchema },
      { name: TeamMember.name, schema: TeamMemberSchema },
      { name: Testimonial.name, schema: TestimonialSchema },
      { name: HostingPackage.name, schema: HostingPackageSchema },
      { name: Faq.name, schema: FaqSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: CompanyInfo.name, schema: CompanyInfoSchema },
    ]),
  ],
  controllers: [PublicHomepageController],
  providers: [PublicHomepageService],
})
export class PublicHomepageModule {}
