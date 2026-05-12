import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  LeadStatus,
  ServiceType,
  LeadType,
  LeadPriority,
  Timeline,
  PreferredContactMethod,
} from '../schemas/lead.schema';

export class FilterLeadsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: LeadStatus,
  })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional({
    description: 'Filter by service type',
    enum: ServiceType,
  })
  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @ApiPropertyOptional({
    description: 'Search in name, email, company',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by lead type',
    enum: LeadType,
  })
  @IsOptional()
  @IsEnum(LeadType)
  leadType?: LeadType;

  @ApiPropertyOptional({
    description: 'Filter by priority',
    enum: LeadPriority,
  })
  @IsOptional()
  @IsEnum(LeadPriority)
  priority?: LeadPriority;

  @ApiPropertyOptional({
    description: 'Filter by timeline',
    enum: Timeline,
  })
  @IsOptional()
  @IsEnum(Timeline)
  timeline?: Timeline;

  @ApiPropertyOptional({
    description: 'Filter by preferred contact method',
    enum: PreferredContactMethod,
  })
  @IsOptional()
  @IsEnum(PreferredContactMethod)
  preferredContactMethod?: PreferredContactMethod;
}
