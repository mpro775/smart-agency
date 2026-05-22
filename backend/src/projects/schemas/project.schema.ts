import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Technology } from '../../technologies/schemas/technology.schema';
import { ProjectCategory as ProjectCategoryEntity } from '../../project-categories/schemas/project-category.schema';

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

@Schema({ _id: false })
export class ProjectStat {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  value: string;

  @Prop()
  description?: string;
}

export enum ProjectCategory {
  WEB_APP = 'Web App',
  MOBILE_APP = 'Mobile App',
  AUTOMATION = 'Automation',
  ERP = 'ERP',
  ECOMMERCE = 'E-Commerce',
  OTHER = 'Other',
}

export enum DisplayVariant {
  STANDARD = 'standard',
  FEATURED = 'featured',
  WIDE = 'wide',
  COMPACT = 'compact',
  CASE_STUDY = 'case_study',
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

  @Prop({ type: [String], default: [] })
  features: string[];

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

  @Prop({ type: Types.ObjectId, ref: 'ProjectCategory' })
  categoryId?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProjectCategory' }], default: [] })
  categoryIds?: Types.ObjectId[];

  @Prop({
    type: [String],
    enum: ProjectCategory,
    default: [],
  })
  projectTypes?: ProjectCategory[];

  @Prop()
  industry?: string;

  @Prop()
  duration?: string;

  @Prop()
  year?: string;

  @Prop()
  clientLogo?: string;

  @Prop()
  accentColor?: string;

  @Prop({ default: 0 })
  sortOrder?: number;

  @Prop({ default: 0 })
  featuredOrder?: number;

  @Prop({
    type: String,
    enum: DisplayVariant,
    default: DisplayVariant.STANDARD,
  })
  displayVariant?: DisplayVariant;

  @Prop({ type: [String], default: [] })
  previewScreens?: string[];

  @Prop()
  videoUrl?: string;

  @Prop({ type: [ProjectStat], default: [] })
  stats?: ProjectStat[];

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
ProjectSchema.index({ category: 1, isPublished: 1 });
ProjectSchema.index({ categoryId: 1 });
ProjectSchema.index({ categoryIds: 1 });
ProjectSchema.index({ projectTypes: 1 });
ProjectSchema.index({ isPublished: 1 });
ProjectSchema.index({ technologies: 1 });
ProjectSchema.index({ sortOrder: 1 });
ProjectSchema.index({ featuredOrder: 1 });
ProjectSchema.index({ isPublished: 1, isFeatured: 1, sortOrder: 1 });
ProjectSchema.index({ createdAt: -1 });

