import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({
    description: 'The question',
    example: 'What services do you offer?',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  questionEn?: string;

  @ApiProperty({
    description: 'The answer (supports rich text/HTML)',
    example:
      '<p>We offer web development, mobile apps, and hosting services.</p>',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsOptional()
  @IsString()
  answerEn?: string;

  @ApiProperty({
    description: 'Category of the FAQ',
    example: 'الخدمات',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ description: 'English category label' })
  @IsOptional()
  @IsString()
  categoryEn?: string;

  @ApiProperty({
    description: 'Stable machine key for the category',
    example: 'general',
  })
  @IsString()
  @IsNotEmpty()
  categoryKey: string;

  @ApiPropertyOptional({
    description: 'Display order (lower numbers appear first)',
    default: 0,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({
    description: 'Whether the FAQ is active/visible',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
