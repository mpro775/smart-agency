import publicApi from "./api";
import type { Blog, Project } from "../admin/types";
import type { CompanyInfo } from "./company-info.service";
import type { FAQ } from "./faqs.service";
import type { HostingPackage } from "./hosting-packages.service";
import type { Service } from "./services.service";
import type { TeamMember } from "./team.service";
import type { Technology } from "./technologies.service";
import type { Testimonial } from "./testimonials.service";
import type { ApiResponse } from "@/types/api";

export interface HomepageData {
  services: Service[];
  featuredProjects: Project[];
  projectCategories: { value: string; label: string; count?: number }[];
  technologies: Technology[];
  teamMembers: TeamMember[];
  testimonials: Testimonial[];
  hostingPackages: HostingPackage[];
  faqs: FAQ[];
  latestBlogs: Blog[];
  companyInfo: CompanyInfo | null;
}

export const homepageService = {
  async get(): Promise<HomepageData> {
    const response =
      await publicApi.get<ApiResponse<HomepageData>>("/public/homepage");
    return response.data.data;
  },
};
