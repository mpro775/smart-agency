import api from './api';
import type { Testimonial, ApiResponse, PaginatedResponse } from '../types';

export interface TestimonialFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface CreateTestimonialDto {
  clientName: string;
  position?: string;
  companyName?: string;
  companyLogo?: string;
  clientPhoto?: string;
  content: string;
  rating?: number;
  linkedProject?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
}

export type UpdateTestimonialDto = Partial<CreateTestimonialDto>;

export const testimonialsService = {
  getAll: async (filters?: TestimonialFilters): Promise<PaginatedResponse<Testimonial>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.isFeatured !== undefined) params.append('isFeatured', String(filters.isFeatured));

    const response = await api.get<ApiResponse<Testimonial[]>>(`/testimonials?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  getById: async (id: string): Promise<Testimonial> => {
    const response = await api.get<ApiResponse<Testimonial>>(`/testimonials/${id}`);
    return response.data.data;
  },

  create: async (data: CreateTestimonialDto): Promise<Testimonial> => {
    const response = await api.post<ApiResponse<Testimonial>>('/testimonials', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateTestimonialDto): Promise<Testimonial> => {
    const response = await api.patch<ApiResponse<Testimonial>>(`/testimonials/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/testimonials/${id}`);
  },
};

