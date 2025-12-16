import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsletterDocument = Newsletter & Document;

@Schema({ timestamps: true })
export class Newsletter {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  })
  email: string;

  @Prop({
    default: 'footer',
    enum: ['footer', 'blog', 'homepage', 'popup']
  })
  source: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  subscribedAt: Date;

  @Prop()
  unsubscribedAt?: Date;
}

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);

// إضافة index للبحث السريع
NewsletterSchema.index({ email: 1 });
NewsletterSchema.index({ source: 1 });
NewsletterSchema.index({ isActive: 1 });
