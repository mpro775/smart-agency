import publicApi from "./api";
import type { ApiResponse } from "@/types/api";
import type { PublicCertificateVerification } from "@/types/credentials";
export const publicCertificatesService = {
  async verify(certificateId: string): Promise<PublicCertificateVerification> {
    const response = await publicApi.get<
      ApiResponse<PublicCertificateVerification>
    >(
      `/certificates/verify/${encodeURIComponent(certificateId.trim().toUpperCase())}`,
    );
    return response.data.data;
  },
};
