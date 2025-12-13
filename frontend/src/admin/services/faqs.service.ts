import api from './api';
import type { FAQ, ApiResponse, PaginatedResponse } from '../types';

export interface FAQFilters {
  page?: number;
  limit?: number;
  category?: string;
  isActive?: boolean;
  search?: string;
}

export interface CreateFAQDto {
  question: string;
  answer: string;
  category?: string;
  orderNumber?: number;
  isActive?: boolean;
}

export type UpdateFAQDto = Partial<CreateFAQDto>;

export const faqsService = {
  getAll: async (filters?: FAQFilters): Promise<PaginatedResponse<FAQ>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.category) params.append('category', filters.category);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<ApiResponse<FAQ[]>>(`/faqs?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  getById: async (id: string): Promise<FAQ> => {
    const response = await api.get<ApiResponse<FAQ>>(`/faqs/${id}`);
    return response.data.data;
  },

  create: async (data: CreateFAQDto): Promise<FAQ> => {
    const response = await api.post<ApiResponse<FAQ>>('/faqs', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateFAQDto): Promise<FAQ> => {
    const response = await api.patch<ApiResponse<FAQ>>(`/faqs/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/faqs/${id}`);
  },
};

