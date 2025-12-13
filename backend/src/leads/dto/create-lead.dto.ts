import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { ServiceType, BudgetRange } from '../schemas/lead.schema';

export class CreateLeadDto {
  @ApiProperty({
    description: 'Full name of the lead',
    example: 'أحمد محمد',
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiPropertyOptional({
    description: 'Company name',
    example: 'شركة النجاح',
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'ahmed@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+966501234567',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Budget range',
    enum: BudgetRange,
    default: BudgetRange.NOT_SPECIFIED,
  })
  @IsOptional()
  @IsEnum(BudgetRange)
  budgetRange?: BudgetRange;

  @ApiProperty({
    description: 'Type of service needed',
    enum: ServiceType,
    example: ServiceType.WEB_APP,
  })
  @IsEnum(ServiceType, { message: 'Invalid service type' })
  serviceType: ServiceType;

  @ApiPropertyOptional({
    description: 'Project description or message',
    example: 'أريد تطوير موقع تجارة إلكترونية...',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    description: 'Lead source',
    example: 'Website Contact Form',
  })
  @IsOptional()
  @IsString()
  source?: string;
}

