import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  ManagedAsset,
  ManagedAssetSchema,
} from '../../common/schemas/managed-asset.schema';

export enum CertificateStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  REVOKED = 'revoked',
}
export enum CertificateType {
  INTERNSHIP = 'internship',
  PRACTICAL_TRAINING = 'practical_training',
  EXPERIENCE = 'experience',
  COURSE_COMPLETION = 'course_completion',
}
@Schema({ _id: false })
export class CertificateSkill {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ trim: true }) nameEn?: string;
}
@Schema({ _id: false })
export class CertificateEvent {
  @Prop({ required: true, enum: ['created', 'updated', 'issued', 'revoked'] })
  action: string;
  @Prop({ type: Types.ObjectId }) actorId?: Types.ObjectId;
  @Prop({ required: true }) at: Date;
  @Prop() note?: string;
}
@Schema({ _id: false })
export class HolderSnapshot {
  @Prop({ required: true }) fullName: string;
  @Prop({ required: true }) fullNameEn: string;
  @Prop({ type: ManagedAssetSchema }) photo?: ManagedAsset;
  @Prop() linkedinUrl?: string;
  @Prop() githubUrl?: string;
  @Prop() portfolioUrl?: string;
}
export type CertificateDocument = HydratedDocument<Certificate>;
@Schema({ timestamps: true, optimisticConcurrency: true })
export class Certificate {
  @Prop({ required: true, uppercase: true, trim: true, immutable: true })
  certificateId: string;
  @Prop({ enum: CertificateStatus, default: CertificateStatus.DRAFT })
  status: CertificateStatus;
  @Prop({ required: true, enum: CertificateType }) type: CertificateType;
  @Prop({ required: true, type: Types.ObjectId, ref: 'Trainee' })
  traineeId: Types.ObjectId;
  @Prop({ required: true, uppercase: true, trim: true }) programCode: string;
  @Prop({ required: true, trim: true }) title: string;
  @Prop({ required: true, trim: true }) titleEn: string;
  @Prop({ required: true, trim: true }) specialization: string;
  @Prop({ required: true, trim: true }) specializationEn: string;
  @Prop({ required: true }) trainingStartDate: Date;
  @Prop({ required: true }) trainingEndDate: Date;
  @Prop() durationLabel?: string;
  @Prop() durationLabelEn?: string;
  @Prop({ type: [SchemaFactory.createForClass(CertificateSkill)], default: [] })
  skills: CertificateSkill[];
  @Prop() description?: string;
  @Prop() descriptionEn?: string;
  @Prop({ required: true, trim: true }) supervisorName: string;
  @Prop() supervisorNameEn?: string;
  @Prop({ required: true, trim: true }) supervisorTitle: string;
  @Prop() supervisorTitleEn?: string;
  @Prop({ default: true }) publicPhotoVisible: boolean;
  @Prop({ default: false }) publicProfessionalLinksVisible: boolean;
  @Prop({ type: ManagedAssetSchema }) certificateImage?: ManagedAsset;
  @Prop({ type: ManagedAssetSchema }) certificatePdf?: ManagedAsset;
  @Prop({ type: SchemaFactory.createForClass(HolderSnapshot) })
  holderSnapshot?: HolderSnapshot;
  @Prop() issuedAt?: Date;
  @Prop() revokedAt?: Date;
  @Prop() revokedReason?: string;
  @Prop({ default: 1 }) revision: number;
  @Prop({ type: Types.ObjectId }) createdBy?: Types.ObjectId;
  @Prop({ type: Types.ObjectId }) updatedBy?: Types.ObjectId;
  @Prop({ type: Types.ObjectId }) issuedBy?: Types.ObjectId;
  @Prop({ type: Types.ObjectId }) revokedBy?: Types.ObjectId;
  @Prop({ uppercase: true, trim: true, immutable: true })
  supersedesCertificateId?: string;
  @Prop({ uppercase: true, trim: true }) supersededByCertificateId?: string;
  @Prop({ type: [SchemaFactory.createForClass(CertificateEvent)], default: [] })
  events: CertificateEvent[];
  createdAt: Date;
  updatedAt: Date;
}
export const CertificateSchema = SchemaFactory.createForClass(Certificate);
CertificateSchema.index({ certificateId: 1 }, { unique: true });
CertificateSchema.index({ traineeId: 1, createdAt: -1 });
CertificateSchema.index({ status: 1, createdAt: -1 });
CertificateSchema.index({ type: 1, status: 1 });
