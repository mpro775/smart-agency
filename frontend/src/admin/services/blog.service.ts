import api from './api';
import type { Blog, ApiResponse, PaginatedResponse } from '../types';

export interface BlogFilters {
  page?: number;
  limit?: number;
  tag?: string;
  isPublished?: boolean;
  categoryKey?: string;
  contentType?: string;
  isFeatured?: boolean;
  search?: string;
  sort?: 'latest' | 'popular' | 'featured';
}

export interface CreateBlogDto {
  title: string;
  titleEn?: string;
  slug: string;
  content: string;
  contentEn?: string;
  excerpt?: string;
  excerptEn?: string;
  coverImage?: string;
  coverAlt?: string;
  coverAltEn?: string;
  tags?: string[];
  tagsEn?: string[];
  category: string;
  categoryEn?: string;
  categoryKey: string;
  contentType?: 'article' | 'guide' | 'case-study' | 'insight' | 'news';
  isPublished?: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  readingTime?: number;
  authorName?: string;
  authorNameEn?: string;
  authorRole?: string;
  authorRoleEn?: string;
  authorAvatar?: string;
  summaryPoints?: string[];
  summaryPointsEn?: string[];
  isEditorPick?: boolean;
  allowIndexing?: boolean;
  ctaTitle?: string;
  ctaTitleEn?: string;
  ctaDescription?: string;
  ctaDescriptionEn?: string;
  ctaButtonText?: string;
  ctaButtonTextEn?: string;
  ctaButtonUrl?: string;
  seo?: {
    metaTitle?: string;
    metaTitleEn?: string;
    metaDescription?: string;
    metaDescriptionEn?: string;
    keywords?: string[];
    keywordsEn?: string[];
    ogTitle?: string;
    ogTitleEn?: string;
    ogDescription?: string;
    ogDescriptionEn?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterTitleEn?: string;
    twitterDescription?: string;
    twitterDescriptionEn?: string;
    twitterImage?: string;
    noIndex?: boolean;
    schemaType?: string;
  };
}

export type UpdateBlogDto = Partial<CreateBlogDto>;

export const blogService = {
  getAll: async (filters?: BlogFilters): Promise<PaginatedResponse<Blog>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.isPublished !== undefined) params.append('isPublished', String(filters.isPublished));
    if (filters?.categoryKey) params.append('categoryKey', filters.categoryKey);
    if (filters?.contentType) params.append('contentType', filters.contentType);
    if (filters?.isFeatured !== undefined) params.append('isFeatured', String(filters.isFeatured));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort) params.append('sort', filters.sort);

    const response = await api.get<ApiResponse<Blog[]>>(`/blog/admin?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  getById: async (id: string): Promise<Blog> => {
    const response = await api.get<ApiResponse<Blog>>(`/blog/${id}`);
    return response.data.data;
  },

  create: async (data: CreateBlogDto): Promise<Blog> => {
    const response = await api.post<ApiResponse<Blog>>('/blog', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateBlogDto): Promise<Blog> => {
    const response = await api.patch<ApiResponse<Blog>>(`/blog/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/blog/${id}`);
  },
};
