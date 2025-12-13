import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeederService } from './seeder.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Blog, BlogSchema } from '../blog/schemas/blog.schema';
import { Faq, FaqSchema } from '../faqs/schemas/faq.schema';
import {
  HostingPackage,
  HostingPackageSchema,
} from '../hosting-packages/schemas/hosting-package.schema';
import { Lead, LeadSchema } from '../leads/schemas/lead.schema';
import { Project, ProjectSchema } from '../projects/schemas/project.schema';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Faq.name, schema: FaqSchema },
      { name: HostingPackage.name, schema: HostingPackageSchema },
      { name: Lead.name, schema: LeadSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: TeamMember.name, schema: TeamMemberSchema },
      { name: Technology.name, schema: TechnologySchema },
      { name: Testimonial.name, schema: TestimonialSchema },
    ]),
  ],
  providers: [SeederService],
})
export class DatabaseModule {}
