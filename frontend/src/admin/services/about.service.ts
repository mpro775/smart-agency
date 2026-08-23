import api from "./api";
import type { ApiResponse } from "../types";

export interface HeroSection {
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  badge?: string;
  badgeEn?: string;
  image?: string;
  primaryButtonText?: string;
  primaryButtonTextEn?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonTextEn?: string;
  secondaryButtonUrl?: string;
  trustBadges?: string[];
  trustBadgesEn?: string[];
}

export interface StorySection {
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  painPoints?: string[];
  painPointsEn?: string[];
  closingStatement?: string;
  closingStatementEn?: string;
}

export interface ThinkingItem {
  icon: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  result?: string;
  resultEn?: string;
}

export interface DifferentiatorItem {
  icon: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  badge?: string;
  badgeEn?: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  deliverable?: string;
  deliverableEn?: string;
  icon?: string;
}

export interface ValueItem {
  icon: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  example?: string;
  exampleEn?: string;
}

export interface StatItem {
  icon: string;
  value: number;
  label: string;
  labelEn?: string;
  suffix?: string;
  suffixEn?: string;
  description?: string;
  descriptionEn?: string;
}

export interface TeamNoteSection {
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  highlights?: string[];
  highlightsEn?: string[];
  image?: string;
}

export interface CTASection {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  buttonText: string;
  buttonTextEn?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonTextEn?: string;
  secondaryButtonUrl?: string;
}

export interface SEOSection {
  metaTitle?: string;
  metaTitleEn?: string;
  metaDescription?: string;
  metaDescriptionEn?: string;
  keywords?: string[];
  keywordsEn?: string[];
  ogImage?: string;
}

export interface About {
  _id: string;
  hero: HeroSection;
  vision: string;
  visionEn?: string;
  mission: string;
  missionEn?: string;
  approach: string;
  approachEn?: string;
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

export interface UpdateAboutDto {
  hero?: HeroSection;
  vision?: string;
  visionEn?: string;
  mission?: string;
  missionEn?: string;
  approach?: string;
  approachEn?: string;
  story?: StorySection;
  thinking?: ThinkingItem[];
  differentiators?: DifferentiatorItem[];
  process?: ProcessStep[];
  values?: ValueItem[];
  stats?: StatItem[];
  teamNote?: TeamNoteSection;
  cta?: CTASection;
  seo?: SEOSection;
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
