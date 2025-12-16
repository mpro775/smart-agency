import publicApi from "./api";
import type { ApiResponse, Project } from "../admin/types";

export interface Testimonial {
  _id: string;
  clientName: string;
  position?: string;
  companyName?: string;
  companyLogo?: string;
  clientPhoto?: string;
  content: string;
  rating?: number;
  linkedProject?: Project | string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimonialFilters {
  isFeatured?: boolean;
  limit?: number;
}

export const publicTestimonialsService = {
  // Get all active testimonials
  getAll: async (filters?: TestimonialFilters): Promise<Testimonial[]> => {
    const params = new URLSearchParams();
    if (filters?.isFeatured !== undefined)
      params.append("isFeatured", String(filters.isFeatured));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const response = await publicApi.get<ApiResponse<Testimonial[]>>(
      `/testimonials?${params.toString()}`
    );
    return response.data.data;
  },

  // Get featured testimonials
  getFeatured: async (): Promise<Testimonial[]> => {
    const response = await publicApi.get<ApiResponse<Testimonial[]>>(
      "/testimonials/featured"
    );
    return response.data.data;
  },

  // Get testimonial by ID
  getById: async (id: string): Promise<Testimonial> => {
    const response = await publicApi.get<ApiResponse<Testimonial>>(
      `/testimonials/${id}`
    );
    return response.data.data;
  },
};
