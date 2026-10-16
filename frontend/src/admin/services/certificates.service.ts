import api from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  Certificate,
  CertificateInput,
  CertificateAdminListItem,
  CertificateStatus,
  CertificateType,
} from "../types";
export interface CertificateFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: CertificateStatus;
  type?: CertificateType;
  traineeId?: string;
  from?: string;
  until?: string;
}
export const certificatesService = {
  async list(
    filters: CertificateFilters = {},
  ): Promise<PaginatedResponse<CertificateAdminListItem>> {
    const { data } = await api.get<ApiResponse<CertificateAdminListItem[]>>(
      "/certificates/admin",
      { params: filters },
    );
    return { data: data.data ?? [], meta: data.meta! };
  },
  async get(id: string) {
    return (
      await api.get<ApiResponse<Certificate>>(`/certificates/admin/${id}`)
    ).data.data;
  },
  async create(input: CertificateInput) {
    return (await api.post<ApiResponse<Certificate>>("/certificates", input))
      .data.data;
  },
  async update(
    id: string,
    input: Partial<Omit<CertificateInput, "supersedesCertificateId">>,
  ) {
    return (
      await api.patch<ApiResponse<Certificate>>(`/certificates/${id}`, input)
    ).data.data;
  },
  async issue(id: string) {
    return (
      await api.post<ApiResponse<Certificate>>(`/certificates/${id}/issue`)
    ).data.data;
  },
  async revoke(id: string, reason: string) {
    return (
      await api.post<ApiResponse<Certificate>>(`/certificates/${id}/revoke`, {
        reason,
      })
    ).data.data;
  },
};
