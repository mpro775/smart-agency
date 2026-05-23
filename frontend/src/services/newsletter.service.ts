import axios from "axios";
import publicApi from "./api";
import type { ApiResponse } from "@/types/api";

export interface NewsletterSubscription {
  email: string;
  source?: string;
}

export interface NewsletterResponse {
  message: string;
  success: boolean;
}

export const newsletterService = {
  async subscribe(data: NewsletterSubscription): Promise<NewsletterResponse> {
    try {
      const response = await publicApi.post<ApiResponse<NewsletterResponse>>(
        "/newsletter/subscribe",
        {
          ...data,
          source: data.source || "footer",
        }
      );

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 409) {
          throw new Error(
            "هذا البريد الإلكتروني مشترك بالفعل في النشرة البريدية"
          );
        }
        if (status === 400) {
          throw new Error("يرجى إدخال بريد إلكتروني صحيح");
        }
      }
      throw new Error("حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى");
    }
  },

  async unsubscribe(email: string): Promise<NewsletterResponse> {
    try {
      const response = await publicApi.post<ApiResponse<NewsletterResponse>>(
        "/newsletter/unsubscribe",
        {
          email,
        }
      );

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error("هذا البريد الإلكتروني غير موجود في قائمتنا");
      }
      throw new Error("حدث خطأ أثناء إلغاء الاشتراك. يرجى المحاولة مرة أخرى");
    }
  },
};
