import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";

export const api = http;

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<ApiResponse<{ url: string }>>(
    "/uploads/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data.url;
};

export const uploadFiles = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await api.post<ApiResponse<{ url: string }[]>>(
    "/uploads/images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data.map((item) => item.url);
};

export default api;
