import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TechnologyCategory } from '../schemas/technology.schema';

export class CreateTechnologyDto {
  @ApiProperty({
    description: 'Technology name',
    example: 'Nest.js',
  })
  @IsString()
  @IsNotEmpty({ message: 'Technology name is required' })
  name: string;

  @ApiPropertyOptional({
    description: 'Technology icon URL (SVG)',
    example: 'https://cdn.example.com/icons/nestjs.svg',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: 'Technology category',
    enum: TechnologyCategory,
    example: TechnologyCategory.BACKEND,
  })
  @IsEnum(TechnologyCategory, { message: 'Invalid technology category' })
  category: TechnologyCategory;

  @ApiPropertyOptional({
    description: 'Technology description',
    example: 'A progressive Node.js framework for building server-side applications',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Technology tooltip for non-technical users',
    example: 'نستخدمها لسرعة استجابة البيانات (Caching)',
  })
  @IsOptional()
  @IsString()
  tooltip?: string;
}

