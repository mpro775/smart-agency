import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type BlogDocument = Blog & Document;

@Schema({ _id: false })
export class BlogSeo {
  @Prop()
  metaTitle: string;

  @Prop()
  metaDescription: string;

  @Prop({ type: [String], default: [] })
  keywords: string[];

  @Prop()
  canonicalUrl: string;

  @Prop()
  ogTitle: string;

  @Prop()
  ogDescription: string;

  @Prop()
  ogImage: string;

  @Prop()
  twitterTitle: string;

  @Prop()
  twitterDescription: string;

  @Prop()
  twitterImage: string;

  @Prop({ default: false })
  noIndex: boolean;

  @Prop({ default: 'Article' })
  schemaType: string;
}

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  excerpt: string;

  @Prop()
  coverImage: string;

  @Prop()
  coverAlt: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: User | Types.ObjectId;

  @Prop()
  authorName: string;

  @Prop()
  authorRole: string;

  @Prop()
  authorAvatar: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

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

  @Prop({ default: false })
  isEditorPick: boolean;

  @Prop({ default: true })
  allowIndexing: boolean;

  @Prop()
  ctaTitle: string;

  @Prop()
  ctaDescription: string;

  @Prop()
  ctaButtonText: string;

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
  excerpt: 'text',
  content: 'text',
  tags: 'text',
  category: 'text',
});
