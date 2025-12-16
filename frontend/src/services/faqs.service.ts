import publicApi from "./api";
import type { ApiResponse } from "../admin/types";

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  orderNumber?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQFilters {
  category?: string;
  limit?: number;
}

export const publicFaqsService = {
  // Get all active FAQs
  getAll: async (filters?: FAQFilters): Promise<FAQ[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.limit) params.append("limit", String(filters.limit));

    const response = await publicApi.get<ApiResponse<FAQ[]>>(
      `/faqs?${params.toString()}`
    );
    return response.data.data;
  },

  // Get FAQs by category
  getByCategory: async (category: string): Promise<FAQ[]> => {
    const response = await publicApi.get<ApiResponse<FAQ[]>>(
      `/faqs/category/${category}`
    );
    return response.data.data;
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    const response = await publicApi.get<ApiResponse<string[]>>(
      "/faqs/categories"
    );
    return response.data.data;
  },
};
