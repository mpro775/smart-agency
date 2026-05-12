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

export enum LeadType {
  CONTACT = "Contact",
  PROJECT_BRIEF = "Project Brief",
  PACKAGE_REQUEST = "Package Request",
}

export enum ProjectStage {
  IDEA = "Idea",
  EXISTING_BUSINESS = "Existing Business",
  REDESIGN = "Redesign",
  SCALING = "Scaling",
}

export enum Timeline {
  URGENT = "Urgent",
  ONE_MONTH = "1 Month",
  TWO_THREE_MONTHS = "2-3 Months",
  FLEXIBLE = "Flexible",
}

export enum PreferredContactMethod {
  WHATSAPP = "WhatsApp",
  PHONE = "Phone",
  EMAIL = "Email",
  MEETING = "Meeting",
}

export enum CompanySize {
  INDIVIDUAL = "Individual",
  STARTUP = "Startup",
  SMALL_BUSINESS = "Small Business",
  COMPANY = "Company",
}

export enum LeadPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
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

  leadType?: LeadType;
  projectStage?: ProjectStage;
  projectGoal?: string;
  timeline?: Timeline;
  preferredContactMethod?: PreferredContactMethod;
  companySize?: CompanySize;
  currentWebsite?: string;
  referenceLinks?: string[];
  hasBrandIdentity?: boolean;
  hasContentReady?: boolean;
  expectedLaunchDate?: string;
  meetingPreference?: string;
  contactReason?: string;
  projectAnswers?: Record<string, unknown>;
  priority?: LeadPriority;
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
  create: async (data: CreateLeadDto): Promise<LeadResponse> => {
    const response = await publicApi.post<ApiResponse<LeadResponse>>(
      "/leads",
      data
    );
    return response.data.data;
  },
};
