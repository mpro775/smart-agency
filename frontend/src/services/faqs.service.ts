import publicApi from "./api";
import type { ApiResponse } from "@/types/api";

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  categoryKey?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQCategory {
  key: string;
  label: string;
}

export interface FAQFilters {
  categoryKey?: string;
  limit?: number;
}

export const publicFaqsService = {
  // Get all active FAQs
  getAll: async (filters?: FAQFilters): Promise<FAQ[]> => {
    const params = new URLSearchParams();
    if (filters?.categoryKey) params.append("categoryKey", filters.categoryKey);
    if (filters?.limit) params.append("limit", String(filters.limit));

    const response = await publicApi.get<ApiResponse<FAQ[]>>(
      `/faqs?${params.toString()}`
    );
    return response.data.data ?? [];
  },

  // Get FAQs by category
  getByCategory: async (category: string): Promise<FAQ[]> => {
    const response = await publicApi.get<ApiResponse<FAQ[]>>(
      `/faqs/category/${category}`
    );
    return response.data.data ?? [];
  },

  // Get all categories
  getCategories: async (): Promise<FAQCategory[]> => {
    const response = await publicApi.get<ApiResponse<FAQCategory[]>>(
      "/faqs/categories"
    );
    return response.data.data ?? [];
  },
};
