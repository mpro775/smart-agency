import publicApi from "./api";
import type { ApiResponse } from "../admin/types";

export interface HostingPackage {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  originalPrice?: number;
  billingCycle?: string;
  category?: string;
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
  // New fields for enhanced package management
  yearlyPrice?: number;
  basePackageId?: string;
  benefitHints?: { [key: string]: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface HostingFilters {
  category?: string;
  isPopular?: boolean;
  limit?: number;
}

export interface PackageSelectionRequest {
  packageId: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  message?: string;
  billingCycle: "Monthly" | "Yearly";
}

export const publicHostingPackagesService = {
  // Get all active hosting packages
  getAll: async (filters?: HostingFilters): Promise<HostingPackage[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.isPopular !== undefined)
      params.append("isPopular", String(filters.isPopular));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const response = await publicApi.get<ApiResponse<HostingPackage[]>>(
      `/hosting-packages?${params.toString()}`
    );
    return response.data.data;
  },

  // Get packages by category
  getByCategory: async (category: string): Promise<HostingPackage[]> => {
    const response = await publicApi.get<ApiResponse<HostingPackage[]>>(
      `/hosting-packages/category/${category}`
    );
    return response.data.data;
  },

  // Get package by ID
  getById: async (id: string): Promise<HostingPackage> => {
    const response = await publicApi.get<ApiResponse<HostingPackage>>(
      `/hosting-packages/${id}`
    );
    return response.data.data;
  },

  // Select a package and submit contact information
  selectPackage: async (
    selectionData: PackageSelectionRequest
  ): Promise<{ message: string }> => {
    const { packageId } = selectionData;
    const response = await publicApi.post<{ message: string }>(
      `/hosting-packages/${packageId}/select`,
      selectionData
    );
    return response.data;
  },
};
