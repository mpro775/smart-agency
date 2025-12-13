import publicApi from "./api";
import type { ApiResponse } from "../admin/types";

export enum ServiceType {
  WEB_APP = "Web App",
  MOBILE_APP = "Mobile App",
  AUTOMATION = "Automation",
  ERP = "ERP",
  ECOMMERCE = "E-Commerce",
  CONSULTATION = "Consultation",
  OTHER = "Other",
}

export enum BudgetRange {
  SMALL = "< $1,000",
  MEDIUM = "$1,000 - $5,000",
  LARGE = "$5,000 - $15,000",
  ENTERPRISE = "$15,000+",
  NOT_SPECIFIED = "Not Specified",
}

export interface CreateLeadDto {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  budgetRange?: BudgetRange;
  serviceType: ServiceType;
  message?: string;
  source?: string;
}

export interface LeadResponse {
  _id: string;
  fullName: string;
  email: string;
  serviceType: ServiceType;
  status: string;
  createdAt: string;
}

export const publicLeadsService = {
  // Submit a new lead (contact form)
  create: async (data: CreateLeadDto): Promise<LeadResponse> => {
    const response = await publicApi.post<ApiResponse<LeadResponse>>(
      "/leads",
      data
    );
    return response.data.data;
  },
};
