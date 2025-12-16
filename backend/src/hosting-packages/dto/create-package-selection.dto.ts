import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { BillingCycle } from '../schemas/hosting-package.schema';

export class CreatePackageSelectionDto {
  @ApiProperty({
    description: 'Selected hosting package ID',
    example: '60d5ecb74b24c72b8c8b4567',
  })
  @IsString()
  @IsNotEmpty({ message: 'Package ID is required' })
  packageId: string;

  @ApiProperty({
    description: 'Full name of the person requesting the package',
    example: 'أحمد محمد',
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'ahmed@example.com',
  })
  @IsString()
  @IsEmail({}, { message: 'Valid email is required' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+966501234567',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @ApiPropertyOptional({
    description: 'Company name (optional)',
    example: 'شركة التجارة الإلكترونية',
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({
    description: 'Additional message or requirements',
    example: 'أحتاج إلى دعم WordPress وSSL مجاني',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: 'Selected billing cycle',
    enum: BillingCycle,
    example: BillingCycle.YEARLY,
  })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;
}
