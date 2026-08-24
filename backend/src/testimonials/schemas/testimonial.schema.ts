import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Project } from '../../projects/schemas/project.schema';

export type TestimonialDocument = Testimonial & Document;

@Schema({ timestamps: true })
export class Testimonial {
  @Prop({ required: true })
  clientName: string;

  @Prop({ required: false })
  clientNameEn?: string;

  @Prop()
  position: string;

  @Prop({ required: false })
  positionEn?: string; // e.g., "CTO at Company X"

  @Prop()
  companyName: string;

  @Prop({ required: false })
  companyNameEn?: string;

  @Prop()
  companyLogo: string;

  @Prop()
  clientPhoto: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  contentEn?: string; // نص الرأي

  @Prop({ min: 1, max: 5, default: 5 })
  rating: number;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  linkedProject: Project | Types.ObjectId; // Optional link to project

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFeatured: boolean; // Show on homepage

  @Prop({ default: 0 })
  sortOrder: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);

// Indexes
TestimonialSchema.index({ isActive: 1 });
TestimonialSchema.index({ isFeatured: 1 });
TestimonialSchema.index({ isActive: 1, isFeatured: 1, sortOrder: 1 });
TestimonialSchema.index({ sortOrder: 1 });
TestimonialSchema.index({ rating: -1 });
