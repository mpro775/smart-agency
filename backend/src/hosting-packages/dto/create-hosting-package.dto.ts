import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsEnum,
  IsDate,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BillingCycle, PackageCategory } from '../schemas/hosting-package.schema';

export class CreateHostingPackageDto {
  @ApiProperty({
    description: 'Package name',
    example: 'Premium VPS',
  })
  @IsString()
  @IsNotEmpty({ message: 'Package name is required' })
  name: string;

  @ApiPropertyOptional({
    description: 'Package description',
    example: 'Perfect for growing businesses with high traffic websites',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Package price',
    example: 50,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'USD',
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Original price (for showing discount)',
    example: 70,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiProperty({
    description: 'Billing cycle',
    enum: BillingCycle,
    example: BillingCycle.MONTHLY,
  })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({
    description: 'Package category',
    enum: PackageCategory,
    example: PackageCategory.VPS,
  })
  @IsEnum(PackageCategory)
  category: PackageCategory;

  @ApiPropertyOptional({
    description: 'List of features',
    type: [String],
    example: ['4GB RAM', '2 vCPU', '50GB SSD', 'Free SSL'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({
    description: 'Mark as popular package',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @ApiPropertyOptional({
    description: 'Mark as best value',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isBestValue?: boolean;

  @ApiPropertyOptional({
    description: 'Is package active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Sort order for display',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  // Technical Specs
  @ApiPropertyOptional({
    description: 'Storage specification',
    example: '50GB SSD',
  })
  @IsOptional()
  @IsString()
  storage?: string;

  @ApiPropertyOptional({
    description: 'Bandwidth specification',
    example: 'Unlimited',
  })
  @IsOptional()
  @IsString()
  bandwidth?: string;

  @ApiPropertyOptional({
    description: 'RAM specification',
    example: '4GB',
  })
  @IsOptional()
  @IsString()
  ram?: string;

  @ApiPropertyOptional({
    description: 'CPU specification',
    example: '2 vCPU',
  })
  @IsOptional()
  @IsString()
  cpu?: string;

  @ApiPropertyOptional({
    description: 'Number of domains',
    example: '5 Domains',
  })
  @IsOptional()
  @IsString()
  domains?: string;

  @ApiPropertyOptional({
    description: 'Discount percentage',
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercentage?: number;

  @ApiPropertyOptional({
    description: 'Promotion end date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  promotionEndsAt?: Date;

  // New fields for enhanced package management
  @ApiPropertyOptional({
    description: 'Yearly price (optional, calculated if not provided)',
    example: 480,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  yearlyPrice?: number;

  @ApiPropertyOptional({
    description: 'Reference to base package ID for feature stacking',
    example: '60d5ecb74b24c72b8c8b4567',
  })
  @IsOptional()
  @IsString()
  basePackageId?: string;

  @ApiPropertyOptional({
    description: 'Benefit hints for technical specs',
    type: 'object',
    example: {
      storage: '50GB (تكفي لحوالي 10,000 زائر شهرياً)',
      ram: '2GB (مناسب للمواقع متوسطة الحجم)',
      cpu: '2 vCPU (أداء سريع للعمليات المعقدة)',
    },
  })
  @IsOptional()
  benefitHints?: { [key: string]: string };
}

