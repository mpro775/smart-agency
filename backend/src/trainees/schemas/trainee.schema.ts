import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  ManagedAsset,
  ManagedAssetSchema,
} from '../../common/schemas/managed-asset.schema';

export type TraineeDocument = HydratedDocument<Trainee>;
@Schema({ timestamps: true })
export class Trainee {
  @Prop({ required: true, trim: true }) fullName: string;
  @Prop({ required: true, trim: true }) fullNameEn: string;
  @Prop({ type: ManagedAssetSchema }) photo?: ManagedAsset;
  @Prop({ trim: true, lowercase: true }) email?: string;
  @Prop({ trim: true }) phone?: string;
  @Prop({ trim: true }) linkedinUrl?: string;
  @Prop({ trim: true }) githubUrl?: string;
  @Prop({ trim: true }) portfolioUrl?: string;
  @Prop({ default: true }) publicPhotoAllowed: boolean;
  @Prop({ default: false }) publicProfessionalLinksAllowed: boolean;
  @Prop() notes?: string;
  @Prop({ default: true }) isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export const TraineeSchema = SchemaFactory.createForClass(Trainee);
TraineeSchema.index({ isActive: 1, createdAt: -1 });
TraineeSchema.index({ fullName: 'text', fullNameEn: 'text' });
TraineeSchema.index({ email: 1 });
