import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Service title',
    example: 'تصميم وتطوير مواقع الويب',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiPropertyOptional({
    description: 'Service description',
    example: 'حلول ويب متكاملة بدءًا من المواقع البسيطة وحتى الأنظمة المعقدة',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Icon identifier or URL',
    example: 'FaCode',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Icon type',
    enum: ['react-icon', 'image', 'emoji'],
    default: 'react-icon',
  })
  @IsOptional()
  @IsString()
  iconType?: string;

  @ApiPropertyOptional({
    description: 'Tailwind gradient classes',
    example: 'from-teal-500 to-teal-600',
    default: 'from-teal-500 to-teal-600',
  })
  @IsOptional()
  @IsString()
  gradient?: string;

  @ApiPropertyOptional({
    description: 'List of features',
    example: ['تصميم متجاوب', 'SEO محسّن', 'أداء عالي'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({
    description: 'Service is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Sort order',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'URL-friendly slug',
    example: 'web-development',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Short description for cards',
    example: 'حلول ويب متكاملة بأحدث التقنيات',
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;
}
