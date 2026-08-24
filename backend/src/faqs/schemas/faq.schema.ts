import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FaqDocument = Faq & Document;

@Schema({ timestamps: true })
export class Faq {
  @Prop({ required: true })
  question: string;

  @Prop({ required: false })
  questionEn?: string;

  @Prop({ required: true })
  answer: string;

  @Prop({ required: false })
  answerEn?: string; // Rich text supported

  @Prop({ required: true, default: 'عام' })
  category: string;

  @Prop({ required: false })
  categoryEn?: string;

  @Prop({ required: true, default: 'general', trim: true, lowercase: true })
  categoryKey: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const FaqSchema = SchemaFactory.createForClass(Faq);

// Indexes for fast querying and ordering
FaqSchema.index({ category: 1 });
FaqSchema.index({ categoryKey: 1 });
FaqSchema.index({ isActive: 1 });
FaqSchema.index({ order: 1 });
