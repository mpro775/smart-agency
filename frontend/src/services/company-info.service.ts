import publicApi from "./api";
import type { ApiResponse } from "@/types/api";

export interface CompanyInfo {
  _id: string;
  address: string;
  googleMapsUrl: string;
  workingHours: string;
  email: string;
  phone: string;
  whatsappUrl: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const companyInfoService = {
  async get(): Promise<CompanyInfo | null> {
    try {
      const response = await publicApi.get<ApiResponse<CompanyInfo | null>>(
        "/company-info"
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching company info:", error);
      return null;
    }
  },
};
