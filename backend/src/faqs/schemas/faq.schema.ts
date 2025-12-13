import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FaqDocument = Faq & Document;

@Schema({ timestamps: true })
export class Faq {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string; // Rich text supported

  @Prop({ default: 'General' })
  category: string;

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
FaqSchema.index({ isActive: 1 });
FaqSchema.index({ order: 1 });

