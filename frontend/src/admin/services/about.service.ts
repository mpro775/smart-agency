import api from "./api";
import type { ApiResponse } from "../types";

export interface HeroSection {
  title: string;
  subtitle: string;
  image?: string;
}

export interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

export interface StatItem {
  icon: string;
  value: number;
  label: string;
}

export interface CTASection {
  title: string;
  description: string;
  buttonText: string;
}

export interface About {
  _id: string;
  hero: HeroSection;
  vision: string;
  mission: string;
  approach: string;
  values: ValueItem[];
  stats: StatItem[];
  cta: CTASection;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAboutDto {
  hero?: HeroSection;
  vision?: string;
  mission?: string;
  approach?: string;
  values?: ValueItem[];
  stats?: StatItem[];
  cta?: CTASection;
  isActive?: boolean;
}

export const aboutService = {
  get: async (): Promise<About | null> => {
    const response = await api.get<ApiResponse<About>>("/about");
    return response.data.data;
  },

  update: async (data: UpdateAboutDto): Promise<About> => {
    const response = await api.patch<ApiResponse<About>>("/about", data);
    return response.data.data;
  },
};
