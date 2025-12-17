import publicApi from "./api";

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
      const response = await publicApi.post<NewsletterResponse>(
        "/newsletter/subscribe",
        {
          ...data,
          source: data.source || "footer",
        }
      );

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 409) {
        throw new Error(
          "هذا البريد الإلكتروني مشترك بالفعل في النشرة البريدية"
        );
      }

      if (error.response?.status === 400) {
        throw new Error("يرجى إدخال بريد إلكتروني صحيح");
      }

      throw new Error("حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى");
    }
  },

  async unsubscribe(email: string): Promise<NewsletterResponse> {
    try {
      const response = await publicApi.post<NewsletterResponse>(
        "/newsletter/unsubscribe",
        {
          email,
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("هذا البريد الإلكتروني غير موجود في قائمتنا");
      }

      throw new Error("حدث خطأ أثناء إلغاء الاشتراك. يرجى المحاولة مرة أخرى");
    }
  },
};
