import api from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  Trainee,
  TraineeInput,
} from "../types";
export interface TraineeFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}
export const traineesService = {
  async list(
    filters: TraineeFilters = {},
  ): Promise<PaginatedResponse<Trainee>> {
    const { data } = await api.get<ApiResponse<Trainee[]>>("/trainees/admin", {
      params: filters,
    });
    return { data: data.data ?? [], meta: data.meta! };
  },
  async get(id: string) {
    return (await api.get<ApiResponse<Trainee>>(`/trainees/admin/${id}`)).data
      .data;
  },
  async create(input: TraineeInput) {
    return (await api.post<ApiResponse<Trainee>>("/trainees", input)).data.data;
  },
  async update(id: string, input: Partial<TraineeInput>) {
    return (await api.patch<ApiResponse<Trainee>>(`/trainees/${id}`, input))
      .data.data;
  },
};
