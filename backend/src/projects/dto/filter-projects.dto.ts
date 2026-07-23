import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsMongoId,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterProjectsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by technology ID',
  })
  @IsOptional()
  @IsMongoId()
  tech?: string;

  @ApiPropertyOptional({
    description: 'Filter by category IDs (comma-separated or single ID)',
  })
  @IsOptional()
  @IsString()
  categoryIds?: string;

  @ApiPropertyOptional({
    description: 'Filter by industry/sector',
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({
    description: 'Filter featured projects only',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Filter featured projects only (alias)',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description:
      'Filter by published status (only works when includeUnpublished is true)',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description: 'Search in title and summary',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
