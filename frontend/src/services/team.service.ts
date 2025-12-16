import publicApi from "./api";
import type { ApiResponse } from "../admin/types";

export interface TeamMember {
  _id: string;
  fullName: string;
  role: string;
  department?: string;
  photo?: string;
  bio?: string;
  funFact?: string;
  email?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  specializations?: string[];
  showOnHome?: boolean;
  showOnAbout?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  joinedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamFilters {
  department?: string;
  showOnHome?: boolean;
}

export const publicTeamService = {
  // Get all active team members
  getAll: async (filters?: TeamFilters): Promise<TeamMember[]> => {
    const params = new URLSearchParams();
    if (filters?.department) params.append("department", filters.department);
    if (filters?.showOnHome !== undefined)
      params.append("showOnHome", String(filters.showOnHome));

    const response = await publicApi.get<ApiResponse<TeamMember[]>>(
      `/team?${params.toString()}`
    );
    return response.data.data;
  },

  // Get team members for homepage
  getForHomepage: async (): Promise<TeamMember[]> => {
    const response = await publicApi.get<ApiResponse<TeamMember[]>>(
      "/team/homepage"
    );
    return response.data.data;
  },

  // Get team member by ID
  getById: async (id: string): Promise<TeamMember> => {
    const response = await publicApi.get<ApiResponse<TeamMember>>(
      `/team/${id}`
    );
    return response.data.data;
  },

  // Get team members by department
  getByDepartment: async (department: string): Promise<TeamMember[]> => {
    const response = await publicApi.get<ApiResponse<TeamMember[]>>(
      `/team/department/${department}`
    );
    return response.data.data;
  },
};
