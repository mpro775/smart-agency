import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Department } from '../schemas/team-member.schema';

export class FilterTeamDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by department',
    enum: Department,
  })
  @IsOptional()
  @IsEnum(Department)
  department?: Department;

  @ApiPropertyOptional({
    description: 'Filter by showOnHome',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  showOnHome?: boolean;

  @ApiPropertyOptional({
    description: 'Filter active members only',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;
}

