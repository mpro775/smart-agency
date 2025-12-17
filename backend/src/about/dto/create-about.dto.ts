import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

class HeroSectionDto {
  @ApiProperty({
    description: 'Hero section title',
    example: 'شركة رقمية تعيد تعريف معايير النجاح',
  })
  @IsString()
  @IsNotEmpty({ message: 'Hero title is required' })
  title: string;

  @ApiProperty({
    description: 'Hero section subtitle',
    example: 'وكالة رقمية عربية متخصصة في تقديم حلول برمجية وتسويقية متكاملة',
  })
  @IsString()
  @IsNotEmpty({ message: 'Hero subtitle is required' })
  subtitle: string;

  @ApiPropertyOptional({
    description: 'Hero section image URL',
    example: 'https://cloudinary.com/image.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid image URL' })
  image?: string;
}

class ValueItemDto {
  @ApiProperty({
    description: 'Icon name (e.g., FiUsers, FaHandshake)',
    example: 'FaHandshake',
  })
  @IsString()
  @IsNotEmpty({ message: 'Icon is required' })
  icon: string;

  @ApiProperty({
    description: 'Value title',
    example: 'الشراكة الاستراتيجية',
  })
  @IsString()
  @IsNotEmpty({ message: 'Value title is required' })
  title: string;

  @ApiProperty({
    description: 'Value description',
    example: 'نعتبر أنفسنا شركاء في نجاحك، لا مجرد مقدمي خدمات',
  })
  @IsString()
  @IsNotEmpty({ message: 'Value description is required' })
  description: string;
}

class StatItemDto {
  @ApiProperty({
    description: 'Stat icon name',
    example: 'FiUsers',
  })
  @IsString()
  @IsNotEmpty({ message: 'Stat icon is required' })
  icon: string;

  @ApiProperty({
    description: 'Stat value',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Stat value is required' })
  value: number;

  @ApiProperty({
    description: 'Stat label',
    example: 'عميل راضٍ',
  })
  @IsString()
  @IsNotEmpty({ message: 'Stat label is required' })
  label: string;
}

class CTASectionDto {
  @ApiProperty({
    description: 'CTA title',
    example: 'مستعد لبدء رحلة نجاحك الرقمية؟',
  })
  @IsString()
  @IsNotEmpty({ message: 'CTA title is required' })
  title: string;

  @ApiProperty({
    description: 'CTA description',
    example: 'تواصل معنا اليوم ونحن سنساعدك على تحويل فكرتك إلى واقع ملموس',
  })
  @IsString()
  @IsNotEmpty({ message: 'CTA description is required' })
  description: string;

  @ApiProperty({
    description: 'CTA button text',
    example: 'تواصل معنا الآن',
  })
  @IsString()
  @IsNotEmpty({ message: 'CTA button text is required' })
  buttonText: string;
}

export class CreateAboutDto {
  @ApiProperty({
    description: 'Hero section',
    type: HeroSectionDto,
  })
  @ValidateNested()
  @Type(() => HeroSectionDto)
  hero: HeroSectionDto;

  @ApiProperty({
    description: 'Vision text',
    example: 'أن نكون الشريك الرقمي الأول للشركات الناشئة',
  })
  @IsString()
  @IsNotEmpty({ message: 'Vision is required' })
  vision: string;

  @ApiProperty({
    description: 'Mission text',
    example: 'نمكّن المشاريع من النمو من خلال مزيج احترافي',
  })
  @IsString()
  @IsNotEmpty({ message: 'Mission is required' })
  mission: string;

  @ApiProperty({
    description: 'Approach text',
    example: 'نتبع منهجية عمل مرنة تجمع بين التخطيط الاستراتيجي',
  })
  @IsString()
  @IsNotEmpty({ message: 'Approach is required' })
  approach: string;

  @ApiProperty({
    description: 'Core values',
    type: [ValueItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValueItemDto)
  values: ValueItemDto[];

  @ApiProperty({
    description: 'Statistics',
    type: [StatItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatItemDto)
  stats: StatItemDto[];

  @ApiProperty({
    description: 'Call to action section',
    type: CTASectionDto,
  })
  @ValidateNested()
  @Type(() => CTASectionDto)
  cta: CTASectionDto;

  @ApiPropertyOptional({
    description: 'Is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
