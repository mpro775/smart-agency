import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../projects/schemas/project.schema';
import { Service, ServiceDocument } from '../services/schemas/service.schema';
import { Lead, LeadDocument } from '../leads/schemas/lead.schema';
import { Blog, BlogDocument } from '../blog/schemas/blog.schema';

export interface DashboardStats {
  totals: {
    projects: number;
    services: number;
    leads: number;
    blogs: number;
  };
  recentLeads: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status: string;
    createdAt?: Date;
  }[];
  contentHealth: {
    inactiveServices: number;
    unpublishedProjects: number;
    draftBlogs: number;
    projectsWithoutCover: number;
  };
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}

  async getStats(): Promise<DashboardStats> {
    const [
      projectsCount,
      servicesCount,
      leadsCount,
      blogsCount,
      inactiveServices,
      unpublishedProjects,
      draftBlogs,
      projectsWithoutCover,
      recentLeads,
    ] = await Promise.all([
      this.projectModel.countDocuments().exec(),
      this.serviceModel.countDocuments().exec(),
      this.leadModel.countDocuments().exec(),
      this.blogModel.countDocuments().exec(),
      this.serviceModel.countDocuments({ isActive: false }).exec(),
      this.projectModel.countDocuments({ isPublished: false }).exec(),
      this.blogModel.countDocuments({ isPublished: false }).exec(),
      this.projectModel
        .countDocuments({
          $or: [
            { 'images.cover': { $exists: false } },
            { 'images.cover': null },
            { 'images.cover': '' },
          ],
        })
        .exec(),
      this.leadModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('_id fullName email phone status createdAt')
        .lean()
        .exec(),
    ]);

    return {
      totals: {
        projects: projectsCount,
        services: servicesCount,
        leads: leadsCount,
        blogs: blogsCount,
      },
      recentLeads: recentLeads.map((lead) => ({
        id: lead._id.toString(),
        name: lead.fullName,
        email: lead.email,
        phone: lead.phone || undefined,
        status: lead.status,
        createdAt: lead.createdAt,
      })),
      contentHealth: {
        inactiveServices,
        unpublishedProjects,
        draftBlogs,
        projectsWithoutCover,
      },
    };
  }
}
