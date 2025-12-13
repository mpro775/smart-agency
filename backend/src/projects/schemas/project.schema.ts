import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Technology } from '../../technologies/schemas/technology.schema';

export type ProjectDocument = Project & Document;

@Schema({ _id: false })
export class ProjectResult {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  value: string;
}

@Schema({ _id: false })
export class ProjectImages {
  @Prop()
  cover: string;

  @Prop({ type: [String], default: [] })
  gallery: string[];
}

@Schema({ _id: false })
export class ProjectSeo {
  @Prop()
  metaTitle: string;

  @Prop()
  metaDescription: string;

  @Prop({ type: [String], default: [] })
  keywords: string[];
}

export enum ProjectCategory {
  WEB_APP = 'Web App',
  MOBILE_APP = 'Mobile App',
  AUTOMATION = 'Automation',
  ERP = 'ERP',
  ECOMMERCE = 'E-Commerce',
  OTHER = 'Other',
}

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ required: true })
  summary: string;

  @Prop()
  challenge: string;

  @Prop()
  solution: string;

  @Prop({ type: [ProjectResult], default: [] })
  results: ProjectResult[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Technology' }] })
  technologies: Technology[] | Types.ObjectId[];

  @Prop({ type: ProjectImages, default: {} })
  images: ProjectImages;

  @Prop()
  projectUrl: string;

  @Prop()
  clientName: string;

  @Prop({
    type: String,
    enum: ProjectCategory,
    default: ProjectCategory.OTHER,
  })
  category: ProjectCategory;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ type: ProjectSeo, default: {} })
  seo: ProjectSeo;

  @Prop({ default: true })
  isPublished: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

// Indexes for faster queries
ProjectSchema.index({ slug: 1 }, { unique: true });
ProjectSchema.index({ isFeatured: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ isPublished: 1 });
ProjectSchema.index({ technologies: 1 });
ProjectSchema.index({ createdAt: -1 });

