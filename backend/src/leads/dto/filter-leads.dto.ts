import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { LeadStatus, ServiceType } from '../schemas/lead.schema';

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
}

