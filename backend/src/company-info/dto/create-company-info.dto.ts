import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsUrl,
  IsObject,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class SocialLinksDto {
  @ApiPropertyOptional({
    description: 'Twitter URL',
    example: 'https://twitter.com/smartagency',
  })
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiPropertyOptional({
    description: 'Instagram URL',
    example: 'https://instagram.com/smartagency',
  })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional({
    description: 'LinkedIn URL',
    example: 'https://linkedin.com/company/smartagency',
  })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiPropertyOptional({
    description: 'Facebook URL',
    example: 'https://facebook.com/smartagency',
  })
  @IsOptional()
  @IsString()
  facebook?: string;
}

export class CreateCompanyInfoDto {
  @ApiProperty({
    description: 'Company address',
    example: 'صنعاء, اليمن',
  })
  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @ApiProperty({
    description: 'Google Maps URL',
    example: 'https://maps.google.com/?q=...',
  })
  @IsUrl({}, { message: 'Please provide a valid Google Maps URL' })
  @IsNotEmpty({ message: 'Google Maps URL is required' })
  googleMapsUrl: string;

  @ApiProperty({
    description: 'Working hours',
    example: 'الأحد - الخميس: 8 ص - 5 م',
  })
  @IsString()
  @IsNotEmpty({ message: 'Working hours is required' })
  workingHours: string;

  @ApiProperty({
    description: 'Company email',
    example: 'info@smartagency.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+967 778 032 532',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @ApiProperty({
    description: 'WhatsApp URL',
    example: 'https://wa.me/967778032532',
  })
  @IsUrl({}, { message: 'Please provide a valid WhatsApp URL' })
  @IsNotEmpty({ message: 'WhatsApp URL is required' })
  whatsappUrl: string;

  @ApiProperty({
    description: 'Social media links',
    type: SocialLinksDto,
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;
}
