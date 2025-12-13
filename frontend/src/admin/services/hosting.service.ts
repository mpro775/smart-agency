import api from './api';
import type { HostingPackage, ApiResponse, PaginatedResponse, PackageCategory, BillingCycle } from '../types';

export interface HostingFilters {
  page?: number;
  limit?: number;
  category?: PackageCategory;
  isActive?: boolean;
  isPopular?: boolean;
}

export interface CreateHostingPackageDto {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  originalPrice?: number;
  billingCycle?: BillingCycle;
  category?: PackageCategory;
  features?: string[];
  isPopular?: boolean;
  isBestValue?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  storage?: string;
  bandwidth?: string;
  ram?: string;
  cpu?: string;
  domains?: string;
  discountPercentage?: number;
  promotionEndsAt?: string;
}

export type UpdateHostingPackageDto = Partial<CreateHostingPackageDto>;

export const hostingService = {
  getAll: async (filters?: HostingFilters): Promise<PaginatedResponse<HostingPackage>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.category) params.append('category', filters.category);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.isPopular !== undefined) params.append('isPopular', String(filters.isPopular));

    const response = await api.get<ApiResponse<HostingPackage[]>>(`/hosting-packages?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  getById: async (id: string): Promise<HostingPackage> => {
    const response = await api.get<ApiResponse<HostingPackage>>(`/hosting-packages/${id}`);
    return response.data.data;
  },

  create: async (data: CreateHostingPackageDto): Promise<HostingPackage> => {
    const response = await api.post<ApiResponse<HostingPackage>>('/hosting-packages', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateHostingPackageDto): Promise<HostingPackage> => {
    const response = await api.patch<ApiResponse<HostingPackage>>(`/hosting-packages/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/hosting-packages/${id}`);
  },
};

