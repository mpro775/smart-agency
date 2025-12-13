import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
  ValidateNested,
  IsUrl,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectCategory } from '../schemas/project.schema';

class ProjectResultDto {
  @ApiProperty({ description: 'Result label', example: 'زيادة المبيعات' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Result value', example: '50%' })
  @IsString()
  @IsNotEmpty()
  value: string;
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

export class CreateProjectDto {
  @ApiProperty({ description: 'Project title', example: 'متجر ريم' })
  @IsString()
  @IsNotEmpty({ message: 'Project title is required' })
  title: string;

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

  @ApiPropertyOptional({
    description: 'The challenge/problem faced',
    example: 'كان العميل يعاني من صعوبة في إدارة المبيعات...',
  })
  @IsOptional()
  @IsString()
  challenge?: string;

  @ApiPropertyOptional({
    description: 'The solution provided',
    example: 'قمنا بتطوير نظام متكامل يشمل...',
  })
  @IsOptional()
  @IsString()
  solution?: string;

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
    description: 'Technology IDs used in the project',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  technologies?: string[];

  @ApiPropertyOptional({ description: 'Project images', type: ProjectImagesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectImagesDto)
  images?: ProjectImagesDto;

  @ApiPropertyOptional({
    description: 'Live project URL',
    example: 'https://rim-store.com',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid project URL' })
  projectUrl?: string;

  @ApiPropertyOptional({ description: 'Client name', example: 'شركة ريم' })
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiProperty({
    description: 'Project category',
    enum: ProjectCategory,
    example: ProjectCategory.MOBILE_APP,
  })
  @IsEnum(ProjectCategory, { message: 'Invalid project category' })
  category: ProjectCategory;

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

