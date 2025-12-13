import api from './api';
import type { Technology, ApiResponse, TechnologyCategory } from '../types';

export interface TechnologyFilters {
  category?: TechnologyCategory;
}

export interface CreateTechnologyDto {
  name: string;
  icon?: string;
  category?: TechnologyCategory;
  description?: string;
}

export type UpdateTechnologyDto = Partial<CreateTechnologyDto>;

export const technologiesService = {
  getAll: async (filters?: TechnologyFilters): Promise<Technology[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);

    const response = await api.get<ApiResponse<Technology[]>>(`/technologies?${params.toString()}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<Technology> => {
    const response = await api.get<ApiResponse<Technology>>(`/technologies/${id}`);
    return response.data.data;
  },

  create: async (data: CreateTechnologyDto): Promise<Technology> => {
    const response = await api.post<ApiResponse<Technology>>('/technologies', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateTechnologyDto): Promise<Technology> => {
    const response = await api.patch<ApiResponse<Technology>>(`/technologies/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/technologies/${id}`);
  },
};

