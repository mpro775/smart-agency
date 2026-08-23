import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsMongoId,
  Min,
  Max,
} from 'class-validator';

export class CreateTestimonialDto {
  @ApiProperty({
    description: 'Client name',
    example: 'أحمد محمد',
  })
  @IsString()
  @IsNotEmpty({ message: 'Client name is required' })
  clientName: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  clientNameEn?: string;

  @ApiPropertyOptional({
    description: 'Client position/title',
    example: 'CTO at Company X',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  positionEn?: string;

  @ApiPropertyOptional({
    description: 'Company name',
    example: 'شركة النجاح',
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyNameEn?: string;

  @ApiPropertyOptional({
    description: 'Company logo URL',
    example: 'https://cdn.example.com/logos/company.png',
  })
  @IsOptional()
  @IsString()
  companyLogo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyLogoEn?: string;

  @ApiPropertyOptional({
    description: 'Client photo URL',
    example: 'https://cdn.example.com/photos/client.jpg',
  })
  @IsOptional()
  @IsString()
  clientPhoto?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientPhotoEn?: string;

  @ApiProperty({
    description: 'Testimonial content',
    example: 'عمل احترافي وتواصل ممتاز. أنصح بهم بشدة!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Testimonial content is required' })
  content: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  contentEn?: string;

  @ApiPropertyOptional({
    description: 'Rating (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Linked project ID',
  })
  @IsOptional()
  @IsMongoId()
  linkedProject?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  linkedProjectEn?: string;

  @ApiPropertyOptional({
    description: 'Is testimonial active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Show on homepage',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
