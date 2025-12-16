import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateProjectCategoryDto {
  @ApiProperty({
    description: 'Category value (enum value)',
    example: 'Web App',
  })
  @IsString()
  @IsNotEmpty({ message: 'Value is required' })
  value: string;

  @ApiProperty({
    description: 'Category label in Arabic',
    example: 'مواقع إلكترونية',
  })
  @IsString()
  @IsNotEmpty({ message: 'Label is required' })
  label: string;

  @ApiPropertyOptional({
    description: 'Category description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Category is active',
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
    description: 'Icon identifier or URL',
  })
  @IsOptional()
  @IsString()
  icon?: string;
}
