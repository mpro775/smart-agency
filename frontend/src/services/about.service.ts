import { publicApi } from "./api";
import type { ApiResponse } from "@/types/api";

export interface HeroSection {
  title: string;
  subtitle: string;
  badge?: string;
  image?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  trustBadges?: string[];
}

export interface StorySection {
  title: string;
  description: string;
  painPoints: string[];
  closingStatement?: string;
}

export interface ThinkingItem {
  icon: string;
  title: string;
  description: string;
  result?: string;
}

export interface DifferentiatorItem {
  icon: string;
  title: string;
  description: string;
  badge?: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  deliverable?: string;
  icon?: string;
}

export interface ValueItem {
  icon: string;
  title: string;
  description: string;
  example?: string;
}

export interface StatItem {
  icon: string;
  value: number;
  label: string;
  suffix?: string;
  description?: string;
}

export interface TeamNoteSection {
  title: string;
  description: string;
  highlights: string[];
  image?: string;
}

export interface CTASection {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
}

export interface SEOSection {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface About {
  _id: string;
  hero: HeroSection;
  vision: string;
  mission: string;
  approach: string;
  story?: StorySection;
  thinking?: ThinkingItem[];
  differentiators?: DifferentiatorItem[];
  process?: ProcessStep[];
  values: ValueItem[];
  stats: StatItem[];
  teamNote?: TeamNoteSection;
  cta: CTASection;
  seo?: SEOSection;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const aboutService = {
  get: async (): Promise<About | null> => {
    const response = await publicApi.get<ApiResponse<About>>("/about");
    return response.data.data;
  },
};
