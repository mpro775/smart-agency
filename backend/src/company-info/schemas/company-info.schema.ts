import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyInfoDocument = CompanyInfo & Document;

@Schema({ timestamps: true })
export class CompanyInfo {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  googleMapsUrl: string;

  @Prop({ required: true })
  workingHours: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  whatsappUrl: string;

  @Prop({
    type: {
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      facebook: { type: String, default: '' },
    },
    default: {},
    required: false,
  })
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export const CompanyInfoSchema = SchemaFactory.createForClass(CompanyInfo);
