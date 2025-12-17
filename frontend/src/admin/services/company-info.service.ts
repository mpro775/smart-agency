import api from "./api";
import type { ApiResponse } from "../types";

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

export interface UpdateCompanyInfoDto {
  address?: string;
  googleMapsUrl?: string;
  workingHours?: string;
  email?: string;
  phone?: string;
  whatsappUrl?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export const companyInfoService = {
  get: async (): Promise<CompanyInfo | null> => {
    const response = await api.get<ApiResponse<CompanyInfo>>("/company-info");
    return response.data.data;
  },

  update: async (data: UpdateCompanyInfoDto): Promise<CompanyInfo> => {
    const response = await api.patch<ApiResponse<CompanyInfo>>(
      "/company-info",
      data
    );
    return response.data.data;
  },
};
