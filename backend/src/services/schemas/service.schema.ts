import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  icon: string; // Icon name or URL

  @Prop()
  iconType: string; // 'react-icon' | 'image' | 'emoji'

  @Prop({ default: 'from-teal-500 to-teal-600' })
  gradient: string; // Tailwind gradient classes

  @Prop({ type: [String], default: [] })
  features: string[]; // List of features/benefits

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop()
  slug: string; // URL-friendly identifier

  @Prop()
  shortDescription: string; // Brief description for cards

  createdAt?: Date;
  updatedAt?: Date;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

// Indexes
ServiceSchema.index({ isActive: 1 });
ServiceSchema.index({ sortOrder: 1 });
ServiceSchema.index({ slug: 1 }, { unique: true });
