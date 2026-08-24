import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsUrl,
  IsMongoId,
  ValidateIf,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class ProjectResultDto {
  @ApiProperty({ description: 'Result label', example: 'زيادة المبيعات' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  labelEn?: string;

  @ApiProperty({ description: 'Result value', example: '50%' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  valueEn?: string;
}

class ProjectImagesDto {
  @ApiPropertyOptional({
    description: 'Cover image URL',
    example: 'https://cdn.example.com/projects/cover.jpg',
  })
  @IsOptional()
  @IsString()
  cover?: string;

  @ApiPropertyOptional({
    description: 'Gallery images URLs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];
}

class ProjectSeoDto {
  @ApiPropertyOptional({ description: 'SEO meta title' })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitleEn?: string;

  @ApiPropertyOptional({ description: 'SEO meta description' })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescriptionEn?: string;

  @ApiPropertyOptional({ description: 'SEO keywords', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywordsEn?: string[];
}

class ProjectStatDto {
  @ApiProperty({ description: 'Stat label', example: 'مدة التنفيذ' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  labelEn?: string;

  @ApiProperty({ description: 'Stat value', example: '45 يوم' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  valueEn?: string;

  @ApiPropertyOptional({ description: 'Stat description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionEn?: string;
}

export class CreateProjectDto {
  @ApiProperty({ description: 'Project title', example: 'متجر ريم' })
  @IsString()
  @IsNotEmpty({ message: 'Project title is required' })
  title: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  titleEn?: string;

  @ApiProperty({
    description: 'Project slug (URL-friendly)',
    example: 'rim-store-app',
  })
  @IsString()
  @IsNotEmpty({ message: 'Project slug is required' })
  slug: string;

  @ApiProperty({
    description: 'Short summary for cards',
    example: 'تطبيق متجر إلكتروني متكامل',
  })
  @IsString()
  @IsNotEmpty({ message: 'Project summary is required' })
  summary: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  summaryEn?: string;

  @ApiPropertyOptional({
    description: 'The challenge/problem faced',
    example: 'كان العميل يعاني من صعوبة في إدارة المبيعات...',
  })
  @IsOptional()
  @IsString()
  challenge?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  challengeEn?: string;

  @ApiPropertyOptional({
    description: 'The solution provided',
    example: 'قمنا بتطوير نظام متكامل يشمل...',
  })
  @IsOptional()
  @IsString()
  solution?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  solutionEn?: string;

  @ApiPropertyOptional({
    description: 'Project results/achievements',
    type: [ProjectResultDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectResultDto)
  results?: ProjectResultDto[];

  @ApiPropertyOptional({
    description: 'Project features',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  featuresEn?: string[];

  @ApiPropertyOptional({
    description: 'Technology IDs used in the project',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  technologies?: string[];

  @ApiPropertyOptional({
    description: 'Project images',
    type: ProjectImagesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectImagesDto)
  images?: ProjectImagesDto;

  @ApiPropertyOptional({
    description: 'Live project URL',
    example: 'https://rim-store.com',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @ValidateIf((_, value) => value !== '')
  @IsUrl({}, { message: 'Invalid project URL' })
  projectUrl?: string;

  @ApiPropertyOptional({ description: 'Client name', example: 'شركة ريم' })
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientNameEn?: string;

  @ApiPropertyOptional({
    description: 'Project category IDs from database',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({
    description: 'Industry/sector',
    example: 'تعليم',
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  industryEn?: string;

  @ApiPropertyOptional({
    description: 'Project duration',
    example: '45 يوم',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  durationEn?: string;

  @ApiPropertyOptional({
    description: 'Project year',
    example: '2025',
  })
  @IsOptional()
  @IsString()
  year?: string;

  @ApiPropertyOptional({
    description: 'Client logo URL',
    example: 'https://cdn.example.com/logos/client.png',
  })
  @IsOptional()
  @IsString()
  clientLogo?: string;

  @ApiPropertyOptional({
    description: 'Sort order for display',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Featured order for featured projects',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  featuredOrder?: number;

  @ApiPropertyOptional({
    description: 'Video URL or demo link',
    example: 'https://youtube.com/watch?v=...',
  })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({
    description: 'Project statistics',
    type: [ProjectStatDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectStatDto)
  stats?: ProjectStatDto[];

  @ApiPropertyOptional({
    description: 'Is featured on homepage',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'SEO metadata', type: ProjectSeoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectSeoDto)
  seo?: ProjectSeoDto;

  @ApiPropertyOptional({ description: 'Is published', default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
