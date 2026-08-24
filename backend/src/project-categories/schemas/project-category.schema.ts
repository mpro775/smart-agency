import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectCategoryDocument = ProjectCategory & Document;

@Schema({ timestamps: true })
export class ProjectCategory {
  @Prop({ required: true, unique: true })
  value: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: false })
  labelEn?: string; // Arabic label e.g., 'مواقع إلكترونية'

  @Prop()
  description: string;

  @Prop({ required: false })
  descriptionEn?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop()
  icon: string; // Optional icon

  createdAt?: Date;
  updatedAt?: Date;
}

export const ProjectCategorySchema =
  SchemaFactory.createForClass(ProjectCategory);

// Indexes
ProjectCategorySchema.index({ value: 1 }, { unique: true });
ProjectCategorySchema.index({ isActive: 1 });
ProjectCategorySchema.index({ sortOrder: 1 });
