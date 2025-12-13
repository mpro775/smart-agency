import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEnum, IsMongoId } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ProjectCategory } from '../schemas/project.schema';

export class FilterProjectsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by technology ID',
  })
  @IsOptional()
  @IsMongoId()
  tech?: string;

  @ApiPropertyOptional({
    description: 'Filter by category',
    enum: ProjectCategory,
  })
  @IsOptional()
  @IsEnum(ProjectCategory)
  category?: ProjectCategory;

  @ApiPropertyOptional({
    description: 'Filter featured projects only',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Search in title and summary',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

