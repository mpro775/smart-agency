import type { ApiResponse } from "@/types/api";

export function unwrapApiResponse<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}
