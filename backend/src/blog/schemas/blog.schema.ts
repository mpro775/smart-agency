import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type BlogDocument = Blog & Document;

@Schema({ _id: false })
export class BlogSeo {
  @Prop()
  metaTitle: string;

  @Prop({ required: false })
  metaTitleEn?: string;

  @Prop()
  metaDescription: string;

  @Prop({ required: false })
  metaDescriptionEn?: string;

  @Prop({ type: [String], default: [] })
  keywords: string[];

  @Prop({ required: false })
  keywordsEn?: string[];

  @Prop()
  canonicalUrl: string;

  @Prop()
  ogTitle: string;

  @Prop({ required: false })
  ogTitleEn?: string;

  @Prop()
  ogDescription: string;

  @Prop({ required: false })
  ogDescriptionEn?: string;

  @Prop()
  ogImage: string;

  @Prop()
  twitterTitle: string;

  @Prop({ required: false })
  twitterTitleEn?: string;

  @Prop()
  twitterDescription: string;

  @Prop({ required: false })
  twitterDescriptionEn?: string;

  @Prop()
  twitterImage: string;

  @Prop({ default: false })
  noIndex: boolean;

  @Prop({ default: 'Article' })
  schemaType: string;

  @Prop({ required: false })
  schemaTypeEn?: string;
}

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  titleEn?: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  contentEn?: string;

  @Prop()
  excerpt: string;

  @Prop({ required: false })
  excerptEn?: string;

  @Prop()
  coverImage: string;

  @Prop()
  coverAlt: string;

  @Prop({ required: false })
  coverAltEn?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: User | Types.ObjectId;

  @Prop()
  authorName: string;

  @Prop({ required: false })
  authorNameEn?: string;

  @Prop()
  authorRole: string;

  @Prop({ required: false })
  authorRoleEn?: string;

  @Prop()
  authorAvatar: string;

  @Prop({ required: false })
  authorAvatarEn?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: false })
  tagsEn?: string[];

  @Prop({ required: true, default: 'general' })
  category: string;

  @Prop({
    enum: ['article', 'guide', 'case-study', 'insight', 'news'],
    default: 'article',
  })
  contentType: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: 0 })
  featuredOrder: number;

  @Prop({ default: 0 })
  readingTime: number;

  @Prop({ type: [String], default: [] })
  summaryPoints: string[];

  @Prop({ required: false })
  summaryPointsEn?: string[];

  @Prop({ default: false })
  isEditorPick: boolean;

  @Prop({ default: true })
  allowIndexing: boolean;

  @Prop()
  ctaTitle: string;

  @Prop({ required: false })
  ctaTitleEn?: string;

  @Prop()
  ctaDescription: string;

  @Prop({ required: false })
  ctaDescriptionEn?: string;

  @Prop()
  ctaButtonText: string;

  @Prop({ required: false })
  ctaButtonTextEn?: string;

  @Prop()
  ctaButtonUrl: string;

  @Prop({ type: BlogSeo, default: {} })
  seo: BlogSeo;

  @Prop()
  publishedAt: Date;

  @Prop({ default: 0 })
  views: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

// Indexes
BlogSchema.index({ slug: 1 }, { unique: true });
BlogSchema.index({ isPublished: 1 });
BlogSchema.index({ isPublished: 1, publishedAt: -1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ contentType: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ isFeatured: 1, featuredOrder: 1 });
BlogSchema.index({ isFeatured: 1, isPublished: 1 });
BlogSchema.index({ views: -1 });
BlogSchema.index({ publishedAt: -1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({
  title: 'text',
  titleEn: 'text',
  excerpt: 'text',
  excerptEn: 'text',
  content: 'text',
  contentEn: 'text',
  tags: 'text',
  tagsEn: 'text',
  category: 'text',
  categoryEn: 'text',
});
