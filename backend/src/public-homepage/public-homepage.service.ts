import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../blog/schemas/blog.schema';
import {
  CompanyInfo,
  CompanyInfoDocument,
} from '../company-info/schemas/company-info.schema';
import { Faq, FaqDocument } from '../faqs/schemas/faq.schema';
import {
  HostingPackage,
  HostingPackageDocument,
} from '../hosting-packages/schemas/hosting-package.schema';
import {
  ProjectCategory,
  ProjectCategoryDocument,
} from '../project-categories/schemas/project-category.schema';
import { Project, ProjectDocument } from '../projects/schemas/project.schema';
import { Service, ServiceDocument } from '../services/schemas/service.schema';
import {
  TeamMember,
  TeamMemberDocument,
} from '../team/schemas/team-member.schema';
import {
  Technology,
  TechnologyDocument,
} from '../technologies/schemas/technology.schema';
import {
  Testimonial,
  TestimonialDocument,
} from '../testimonials/schemas/testimonial.schema';

@Injectable()
export class PublicHomepageService {
  constructor(
    @InjectModel(Service.name)
    private readonly serviceModel: Model<ServiceDocument>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(ProjectCategory.name)
    private readonly projectCategoryModel: Model<ProjectCategoryDocument>,
    @InjectModel(Technology.name)
    private readonly technologyModel: Model<TechnologyDocument>,
    @InjectModel(TeamMember.name)
    private readonly teamMemberModel: Model<TeamMemberDocument>,
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<TestimonialDocument>,
    @InjectModel(HostingPackage.name)
    private readonly hostingPackageModel: Model<HostingPackageDocument>,
    @InjectModel(Faq.name)
    private readonly faqModel: Model<FaqDocument>,
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>,
    @InjectModel(CompanyInfo.name)
    private readonly companyInfoModel: Model<CompanyInfoDocument>,
  ) {}

  async getHomepage() {
    const [
      services,
      featuredProjects,
      projectCategories,
      technologies,
      teamMembers,
      testimonials,
      hostingPackages,
      faqs,
      latestBlogs,
      companyInfo,
    ] = await Promise.all([
      this.serviceModel
        .find({ isActive: true })
        .sort({ sortOrder: 1, createdAt: -1 })
        .limit(6)
        .select(
          'title slug shortDescription description icon iconType features sortOrder',
        )
        .lean()
        .exec(),
      this.projectModel
        .find({ isPublished: true, isFeatured: true })
        .sort({ featuredOrder: 1, sortOrder: 1, createdAt: -1 })
        .limit(6)
        .select(
          'title slug summary images category categoryId categoryIds projectTypes industry year technologies results displayVariant accentColor',
        )
        .lean()
        .exec(),
      this.projectCategoryModel
        .find({ isActive: true })
        .sort({ sortOrder: 1, label: 1 })
        .limit(12)
        .select('value label description icon sortOrder')
        .lean()
        .exec(),
      this.technologyModel
        .find()
        .sort({ category: 1, name: 1 })
        .limit(24)
        .select('name icon category description tooltip')
        .lean()
        .exec(),
      this.teamMemberModel
        .find({ isActive: true, showOnHome: true })
        .sort({ sortOrder: 1, createdAt: -1 })
        .limit(8)
        .select(
          'fullName role department photo bio funFact specializations projectsCount linkedinUrl githubUrl websiteUrl sortOrder',
        )
        .lean()
        .exec(),
      this.testimonialModel
        .find({ isActive: true, isFeatured: true })
        .sort({ sortOrder: 1, createdAt: -1 })
        .limit(6)
        .select(
          'clientName position companyName companyLogo clientPhoto content rating linkedProject sortOrder',
        )
        .lean()
        .exec(),
      this.hostingPackageModel
        .find({ isActive: true })
        .sort({ sortOrder: 1, price: 1 })
        .limit(6)
        .select(
          'name description price currency originalPrice billingCycle category features isPopular isBestValue storage bandwidth ram cpu domains yearlyPrice benefitHints sortOrder',
        )
        .lean()
        .exec(),
      this.faqModel
        .find({ isActive: true })
        .sort({ order: 1, createdAt: -1 })
        .limit(6)
        .select('question answer category order')
        .lean()
        .exec(),
      this.blogModel
        .find({ isPublished: true })
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(3)
        .select(
          'title slug excerpt coverImage coverAlt category contentType readingTime publishedAt authorName authorRole authorAvatar tags',
        )
        .lean()
        .exec(),
      this.companyInfoModel
        .findOne()
        .select(
          'address googleMapsUrl workingHours email phone whatsappUrl socialLinks',
        )
        .lean()
        .exec(),
    ]);

    return {
      services,
      featuredProjects,
      projectCategories,
      technologies,
      teamMembers,
      testimonials,
      hostingPackages,
      faqs,
      latestBlogs,
      companyInfo,
    };
  }
}
