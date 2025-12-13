import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateLeadDto } from './create-lead.dto';
import { LeadStatus } from '../schemas/lead.schema';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @ApiPropertyOptional({
    description: 'Lead status',
    enum: LeadStatus,
  })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional({
    description: 'Internal notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

