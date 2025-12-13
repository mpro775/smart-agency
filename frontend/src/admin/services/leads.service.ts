import api from './api';
import type { Lead, ApiResponse, PaginatedResponse, LeadStatus, ServiceType } from '../types';

export interface LeadFilters {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  serviceType?: ServiceType;
  search?: string;
}

export interface UpdateLeadDto {
  status?: LeadStatus;
  notes?: string;
}

export const leadsService = {
  getAll: async (filters?: LeadFilters): Promise<PaginatedResponse<Lead>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.status) params.append('status', filters.status);
    if (filters?.serviceType) params.append('serviceType', filters.serviceType);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  getById: async (id: string): Promise<Lead> => {
    const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data.data;
  },

  update: async (id: string, data: UpdateLeadDto): Promise<Lead> => {
    const response = await api.patch<ApiResponse<Lead>>(`/leads/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },
};

