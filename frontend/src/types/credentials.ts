export interface ManagedAsset {
  url: string;
  publicId: string;
  mimeType: string;
  bytes: number;
  originalName?: string;
  sha256?: string;
  width?: number;
  height?: number;
}
export interface Trainee {
  _id: string;
  fullName: string;
  fullNameEn: string;
  photo?: ManagedAsset | null;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  publicPhotoAllowed: boolean;
  publicProfessionalLinksAllowed: boolean;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export type TraineeInput = Omit<Trainee, "_id" | "createdAt" | "updatedAt">;
export type CertificateStatus = "draft" | "active" | "revoked";
export type CertificateType =
  | "internship"
  | "practical_training"
  | "experience"
  | "course_completion";
export interface CertificateSkill {
  name: string;
  nameEn?: string;
}
export interface CertificateInput {
  traineeId: string;
  type: CertificateType;
  programCode: string;
  title: string;
  titleEn: string;
  specialization: string;
  specializationEn: string;
  trainingStartDate: string;
  trainingEndDate: string;
  durationLabel?: string;
  durationLabelEn?: string;
  skills: CertificateSkill[];
  description?: string;
  descriptionEn?: string;
  supervisorName: string;
  supervisorNameEn?: string;
  supervisorTitle: string;
  supervisorTitleEn?: string;
  publicPhotoVisible: boolean;
  publicProfessionalLinksVisible: boolean;
  certificateImage?: ManagedAsset | null;
  certificatePdf?: ManagedAsset | null;
  supersedesCertificateId?: string;
}
export interface Certificate extends CertificateInput {
  _id: string;
  certificateId: string;
  verificationUrl: string;
  status: CertificateStatus;
  holderSnapshot?: Pick<
    Trainee,
    | "fullName"
    | "fullNameEn"
    | "photo"
    | "linkedinUrl"
    | "githubUrl"
    | "portfolioUrl"
  >;
  issuedAt?: string;
  revokedAt?: string;
  revokedReason?: string;
  revision: number;
  supersededByCertificateId?: string;
  events: { action: string; actorId?: string; at: string; note?: string }[];
  createdAt: string;
  updatedAt: string;
}
export interface CertificateAdminListItem extends Omit<
  Certificate,
  "traineeId"
> {
  traineeId:
    | (Pick<Trainee, "_id" | "fullName" | "fullNameEn"> & {
        photo?: { url: string };
      })
    | null;
}
export interface PublicCertificateVerification {
  certificateId: string;
  status: "active" | "revoked";
  authentic: boolean;
  verificationUrl: string;
  wasIssuedBySmartAgency?: boolean;
  revokedAt?: string;
  holder: { fullName: string; fullNameEn: string; photoUrl?: string };
  credential: {
    type?: CertificateType;
    title?: string;
    titleEn?: string;
    specialization: string;
    specializationEn: string;
    trainingStartDate?: string;
    trainingEndDate?: string;
    durationLabel?: string;
    durationLabelEn?: string;
    skills?: CertificateSkill[];
    description?: string;
    descriptionEn?: string;
    issuedAt?: string;
  };
  supervisor?: {
    name: string;
    nameEn?: string;
    title: string;
    titleEn?: string;
  };
  issuer?: { name: string; nameEn: string; website: string };
  files?: { certificateImageUrl?: string; certificatePdfUrl?: string };
  professionalLinks?: {
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  };
}
