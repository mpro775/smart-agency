import api from './api';
import type { ApiResponse } from '../types';

export interface ProjectCategory {
  _id: string;
  value: string;
  label: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectCategoryDto {
  value: string;
  label: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
  icon?: string;
}

export type UpdateProjectCategoryDto = Partial<CreateProjectCategoryDto>;

export const projectCategoriesService = {
  getAll: async (): Promise<ProjectCategory[]> => {
    const response = await api.get<ApiResponse<ProjectCategory[]>>(
      '/project-categories'
    );
    return response.data.data;
  },

  getActive: async (): Promise<ProjectCategory[]> => {
    const response = await api.get<ApiResponse<ProjectCategory[]>>(
      '/project-categories/active'
    );
    return response.data.data;
  },

  getById: async (id: string): Promise<ProjectCategory> => {
    const response = await api.get<ApiResponse<ProjectCategory>>(
      `/project-categories/${id}`
    );
    return response.data.data;
  },

  create: async (
    data: CreateProjectCategoryDto,
  ): Promise<ProjectCategory> => {
    const response = await api.post<ApiResponse<ProjectCategory>>(
      '/project-categories',
      data
    );
    return response.data.data;
  },

  update: async (
    id: string,
    data: UpdateProjectCategoryDto,
  ): Promise<ProjectCategory> => {
    const response = await api.patch<ApiResponse<ProjectCategory>>(
      `/project-categories/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/project-categories/${id}`);
  },
};
