import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsArray,
  IsBoolean,
  IsDateString,
  IsObject,
} from 'class-validator';
import {
  ServiceType,
  BudgetRange,
  LeadType,
  ProjectStage,
  Timeline,
  PreferredContactMethod,
  CompanySize,
  LeadPriority,
} from '../schemas/lead.schema';

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

  @ApiPropertyOptional({
    description: 'Lead type',
    enum: LeadType,
    default: LeadType.PROJECT_BRIEF,
  })
  @IsOptional()
  @IsEnum(LeadType)
  leadType?: LeadType;

  @ApiPropertyOptional({
    description: 'Project stage',
    enum: ProjectStage,
  })
  @IsOptional()
  @IsEnum(ProjectStage)
  projectStage?: ProjectStage;

  @ApiPropertyOptional({
    description: 'Project goal',
    example: 'إطلاق متجر إلكتروني لإدارة الطلبات',
  })
  @IsOptional()
  @IsString()
  projectGoal?: string;

  @ApiPropertyOptional({
    description: 'Timeline',
    enum: Timeline,
  })
  @IsOptional()
  @IsEnum(Timeline)
  timeline?: Timeline;

  @ApiPropertyOptional({
    description: 'Preferred contact method',
    enum: PreferredContactMethod,
  })
  @IsOptional()
  @IsEnum(PreferredContactMethod)
  preferredContactMethod?: PreferredContactMethod;

  @ApiPropertyOptional({
    description: 'Company size',
    enum: CompanySize,
  })
  @IsOptional()
  @IsEnum(CompanySize)
  companySize?: CompanySize;

  @ApiPropertyOptional({
    description: 'Current website URL',
    example: 'https://example.com',
  })
  @IsOptional()
  @IsString()
  currentWebsite?: string;

  @ApiPropertyOptional({
    description: 'Reference links',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  referenceLinks?: string[];

  @ApiPropertyOptional({
    description: 'Has brand identity',
  })
  @IsOptional()
  @IsBoolean()
  hasBrandIdentity?: boolean;

  @ApiPropertyOptional({
    description: 'Has content ready',
  })
  @IsOptional()
  @IsBoolean()
  hasContentReady?: boolean;

  @ApiPropertyOptional({
    description: 'Expected launch date',
    example: '2026-06-01',
  })
  @IsOptional()
  @IsDateString()
  expectedLaunchDate?: string;

  @ApiPropertyOptional({
    description: 'Meeting preference',
    example: 'morning',
  })
  @IsOptional()
  @IsString()
  meetingPreference?: string;

  @ApiPropertyOptional({
    description: 'Contact reason',
    example: 'general',
  })
  @IsOptional()
  @IsString()
  contactReason?: string;

  @ApiPropertyOptional({
    description: 'Project answers',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  projectAnswers?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Lead priority',
    enum: LeadPriority,
    default: LeadPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(LeadPriority)
  priority?: LeadPriority;
}
