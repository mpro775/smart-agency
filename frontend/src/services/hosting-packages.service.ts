import publicApi from "./api";
import type { ApiResponse } from "@/types/api";
import {
  LeadType,
  publicLeadsService,
  ServiceType,
} from "./leads.service";

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

    if (packageId === "enterprise-custom" || packageId === "custom") {
      await publicLeadsService.create({
        fullName: selectionData.fullName,
        email: selectionData.email,
        phone: selectionData.phone,
        companyName: selectionData.companyName,
        message:
          selectionData.message ||
          `Custom hosting request (${selectionData.billingCycle})`,
        leadType: LeadType.PACKAGE_REQUEST,
        source: "Enterprise Custom Hosting",
        serviceType: ServiceType.OTHER,
      });

      return {
        message: "Thank you for your interest! We will contact you soon.",
      };
    }

    const response = await publicApi.post<ApiResponse<{ message: string }>>(
      `/hosting-packages/${packageId}/select`,
      selectionData
    );
    return response.data.data;
  },
};
