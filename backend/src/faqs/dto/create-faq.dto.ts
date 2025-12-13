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

  @ApiProperty({
    description: 'The answer (supports rich text/HTML)',
    example: '<p>We offer web development, mobile apps, and hosting services.</p>',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiPropertyOptional({
    description: 'Category of the FAQ',
    default: 'General',
    example: 'Services',
  })
  @IsOptional()
  @IsString()
  category?: string;

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
