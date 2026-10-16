import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";
import type { ManagedAsset } from '@/types/credentials';

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

const supportedImages = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
async function uploadManaged(file: File, folder: string, document: boolean): Promise<ManagedAsset> {
  if (!file.size || file.size > 15 * 1024 * 1024) throw new Error('حجم الملف يجب ألا يتجاوز 15 MB');
  if (document ? file.type !== 'application/pdf' || !/\.pdf$/i.test(file.name) : !supportedImages.includes(file.type)) throw new Error(document ? 'اختر ملف PDF صالحاً' : 'اختر صورة JPEG / PNG / GIF / WebP / SVG');
  const form = new FormData(); form.append('file', file);
  const response = await api.post<ApiResponse<ManagedAsset>>(`/uploads/${document ? 'document' : 'image'}`, form, { params: { folder }, headers: { 'Content-Type': 'multipart/form-data' } });
  const { url, publicId, mimeType, bytes, originalName, sha256, width, height } = response.data.data;
  return { url, publicId, mimeType, bytes, ...(originalName ? { originalName } : {}), ...(sha256 ? { sha256 } : {}), ...(width ? { width } : {}), ...(height ? { height } : {}) };
}
export const uploadManagedImage = (file: File, folder: string) => uploadManaged(file, folder, false);
export const uploadPdfDocument = (file: File, folder = 'certificates/pdf') => uploadManaged(file, folder, true);
