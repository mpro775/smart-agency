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

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: User | Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: false })
  isPublished: boolean;

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
BlogSchema.index({ tags: 1 });
BlogSchema.index({ publishedAt: -1 });
BlogSchema.index({ createdAt: -1 });

