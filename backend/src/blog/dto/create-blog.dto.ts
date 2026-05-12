import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum BlogContentType {
  ARTICLE = 'article',
  GUIDE = 'guide',
  CASE_STUDY = 'case-study',
  INSIGHT = 'insight',
  NEWS = 'news',
}

class BlogSeoDto {
  @ApiPropertyOptional({ description: 'SEO meta title' })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'SEO meta description' })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'SEO keywords', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  canonicalUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  twitterTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  twitterDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  twitterImage?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  noIndex?: boolean;

  @ApiPropertyOptional({ default: 'Article' })
  @IsOptional()
  @IsString()
  schemaType?: string;
}

export class CreateBlogDto {
  @ApiProperty({
    description: 'Blog post title',
    example: 'كيف تبني تطبيق ناجح',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'Blog post slug (URL-friendly)',
    example: 'how-to-build-successful-app',
  })
  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  slug: string;

  @ApiProperty({
    description: 'Blog post content (HTML/Markdown)',
    example: '<p>محتوى المقال...</p>',
  })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @ApiPropertyOptional({
    description: 'Short excerpt for previews',
    example: 'تعلم كيفية بناء تطبيق ناجح من الصفر...',
  })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({
    description: 'Cover image URL',
    example: 'https://cdn.example.com/blog/cover.jpg',
  })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ description: 'Cover image alternative text' })
  @IsOptional()
  @IsString()
  coverAlt?: string;

  @ApiPropertyOptional({ example: 'ai' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: BlogContentType })
  @IsOptional()
  @IsEnum(BlogContentType)
  contentType?: BlogContentType;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  featuredOrder?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  readingTime?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authorName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authorRole?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authorAvatar?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  summaryPoints?: string[];

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isEditorPick?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  allowIndexing?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaButtonText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaButtonUrl?: string;

  @ApiPropertyOptional({
    description: 'Tags for the blog post',
    type: [String],
    example: ['programming', 'mobile', 'tips'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Publish immediately',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ description: 'SEO metadata', type: BlogSeoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BlogSeoDto)
  seo?: BlogSeoDto;
}
