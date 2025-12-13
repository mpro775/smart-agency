import api from './api';
import type { TeamMember, ApiResponse, PaginatedResponse, Department } from '../types';

export interface TeamFilters {
  page?: number;
  limit?: number;
  department?: Department;
  isActive?: boolean;
  showOnHome?: boolean;
}

export interface CreateTeamMemberDto {
  fullName: string;
  role: string;
  department?: Department;
  photo?: string;
  bio?: string;
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
}

export type UpdateTeamMemberDto = Partial<CreateTeamMemberDto>;

export const teamService = {
  getAll: async (filters?: TeamFilters): Promise<PaginatedResponse<TeamMember>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.department) params.append('department', filters.department);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.showOnHome !== undefined) params.append('showOnHome', String(filters.showOnHome));

    const response = await api.get<ApiResponse<TeamMember[]>>(`/team?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  getById: async (id: string): Promise<TeamMember> => {
    const response = await api.get<ApiResponse<TeamMember>>(`/team/${id}`);
    return response.data.data;
  },

  create: async (data: CreateTeamMemberDto): Promise<TeamMember> => {
    const response = await api.post<ApiResponse<TeamMember>>('/team', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateTeamMemberDto): Promise<TeamMember> => {
    const response = await api.patch<ApiResponse<TeamMember>>(`/team/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/team/${id}`);
  },
};

