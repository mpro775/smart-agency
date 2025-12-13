import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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

