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
    example: 'لا نبني مواقع فقط... نبني أنظمة رقمية تساعد الشركات على النمو',
  })
  @IsString()
  @IsNotEmpty({ message: 'Hero title is required' })
  title: string;

  @ApiProperty({
    description: 'Hero section subtitle',
    example:
      'سمارت وكالة تقنية تجمع بين الاستراتيجية، تجربة المستخدم، التصميم، البرمجة، والذكاء الاصطناعي',
  })
  @IsString()
  @IsNotEmpty({ message: 'Hero subtitle is required' })
  subtitle: string;

  @ApiPropertyOptional({
    description: 'Hero badge text',
    example: 'من نحن',
  })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({
    description: 'Hero section image URL',
    example: 'https://cloudinary.com/image.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid image URL' })
  image?: string;

  @ApiPropertyOptional({
    description: 'Primary button text',
    example: 'ابدأ مشروعك معنا',
  })
  @IsOptional()
  @IsString()
  primaryButtonText?: string;

  @ApiPropertyOptional({
    description: 'Primary button URL',
    example: '/contact',
  })
  @IsOptional()
  @IsString()
  primaryButtonUrl?: string;

  @ApiPropertyOptional({
    description: 'Secondary button text',
    example: 'شاهد أعمالنا',
  })
  @IsOptional()
  @IsString()
  secondaryButtonText?: string;

  @ApiPropertyOptional({
    description: 'Secondary button URL',
    example: '/projects',
  })
  @IsOptional()
  @IsString()
  secondaryButtonUrl?: string;

  @ApiPropertyOptional({
    description: 'Trust badges list',
    example: ['استراتيجية قبل التنفيذ', 'تصميم يخدم التحويل'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  trustBadges?: string[];
}

class StorySectionDto {
  @ApiPropertyOptional({
    description: 'Story section title',
    example: 'لماذا وُجدت سمارت؟',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Story description',
    example:
      'كثير من المشاريع لا تفشل بسبب ضعف الفكرة، بل بسبب ضعف تحويلها إلى تجربة واضحة',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Pain points list',
    example: ['أفكار قوية تضيع بسبب تنفيذ تقليدي'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  painPoints?: string[];

  @ApiPropertyOptional({
    description: 'Closing statement',
    example: 'نحن لا نتعامل مع المشروع كتصميم أو كود فقط',
  })
  @IsOptional()
  @IsString()
  closingStatement?: string;
}

class ThinkingItemDto {
  @ApiProperty({
    description: 'Icon name (e.g., FiSearch, FiPenTool)',
    example: 'FiSearch',
  })
  @IsString()
  @IsNotEmpty({ message: 'Icon is required' })
  icon: string;

  @ApiProperty({
    description: 'Thinking item title',
    example: 'نفهم قبل أن نصمم',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'Thinking item description',
    example: 'نبدأ بفهم الهدف التجاري، طبيعة الجمهور، رحلة المستخدم',
  })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiPropertyOptional({
    description: 'Result text',
    example: 'مخرجات أوضح قبل الدخول في التصميم والتنفيذ',
  })
  @IsOptional()
  @IsString()
  result?: string;
}

class DifferentiatorItemDto {
  @ApiProperty({
    description: 'Icon name',
    example: 'FiLayers',
  })
  @IsString()
  @IsNotEmpty({ message: 'Icon is required' })
  icon: string;

  @ApiProperty({
    description: 'Differentiator title',
    example: 'نفهم المنتج وليس الكود فقط',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'Differentiator description',
    example: 'نتعامل مع كل مشروع كسير عمل وتجربة وهدف تجاري',
  })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiPropertyOptional({
    description: 'Badge text',
    example: 'Product Mindset',
  })
  @IsOptional()
  @IsString()
  badge?: string;
}

class ProcessStepDto {
  @ApiProperty({
    description: 'Step number',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Step number is required' })
  step: number;

  @ApiProperty({
    description: 'Step title',
    example: 'الاكتشاف والتحليل',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'Step description',
    example: 'نحدد الهدف، الجمهور، نطاق المشروع، الأولويات',
  })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiPropertyOptional({
    description: 'Deliverable text',
    example: 'ملخص المتطلبات وخريطة أولية للحل',
  })
  @IsOptional()
  @IsString()
  deliverable?: string;

  @ApiPropertyOptional({
    description: 'Icon name',
    example: 'FiSearch',
  })
  @IsOptional()
  @IsString()
  icon?: string;
}

class PrincipleItemDto {
  @ApiProperty({
    description: 'Icon name',
    example: 'FiTarget',
  })
  @IsString()
  @IsNotEmpty({ message: 'Icon is required' })
  icon: string;

  @ApiProperty({
    description: 'Principle title',
    example: 'لا نبدأ قبل فهم الهدف',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'Principle description',
    example: 'كل قرار تصميمي أو تقني يجب أن يخدم هدفًا واضحًا',
  })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiPropertyOptional({
    description: 'Practical example',
    example: 'قبل التصميم نسأل: ما القرار الذي نريد من المستخدم اتخاذه؟',
  })
  @IsOptional()
  @IsString()
  example?: string;
}

class StatItemDto {
  @ApiProperty({
    description: 'Stat icon name',
    example: 'FiBriefcase',
  })
  @IsString()
  @IsNotEmpty({ message: 'Stat icon is required' })
  icon: string;

  @ApiProperty({
    description: 'Stat value',
    example: 20,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Stat value is required' })
  value: number;

  @ApiProperty({
    description: 'Stat label',
    example: 'مشروع رقمي',
  })
  @IsString()
  @IsNotEmpty({ message: 'Stat label is required' })
  label: string;

  @ApiPropertyOptional({
    description: 'Stat suffix (e.g., +, %)',
    example: '+',
  })
  @IsOptional()
  @IsString()
  suffix?: string;

  @ApiPropertyOptional({
    description: 'Stat description',
    example: 'بين مواقع تعريفية، متاجر إلكترونية، تطبيقات',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

class TeamNoteSectionDto {
  @ApiPropertyOptional({
    description: 'Team note title',
    example: 'فريق صغير بعقلية تنفيذ كبيرة',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Team note description',
    example: 'نؤمن أن قوة الوكالة لا تقاس بعدد الأشخاص فقط',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Highlights list',
    example: ['تواصل مباشر وواضح', 'قرارات مبنية على هدف المشروع'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @ApiPropertyOptional({
    description: 'Team image URL',
    example: 'https://cloudinary.com/team.jpg',
  })
  @IsOptional()
  @IsUrl()
  image?: string;
}

class CTASectionDto {
  @ApiProperty({
    description: 'CTA title',
    example: 'هل لديك فكرة وتريد تحويلها إلى منتج رقمي حقيقي؟',
  })
  @IsString()
  @IsNotEmpty({ message: 'CTA title is required' })
  title: string;

  @ApiProperty({
    description: 'CTA description',
    example: 'شاركنا فكرتك، وسنساعدك على تحويلها إلى تجربة واضحة',
  })
  @IsString()
  @IsNotEmpty({ message: 'CTA description is required' })
  description: string;

  @ApiProperty({
    description: 'CTA button text',
    example: 'ابدأ مشروعك معنا',
  })
  @IsString()
  @IsNotEmpty({ message: 'CTA button text is required' })
  buttonText: string;

  @ApiPropertyOptional({
    description: 'CTA button URL',
    example: '/contact',
  })
  @IsOptional()
  @IsString()
  buttonUrl?: string;

  @ApiPropertyOptional({
    description: 'Secondary button text',
    example: 'استعرض أعمالنا',
  })
  @IsOptional()
  @IsString()
  secondaryButtonText?: string;

  @ApiPropertyOptional({
    description: 'Secondary button URL',
    example: '/projects',
  })
  @IsOptional()
  @IsString()
  secondaryButtonUrl?: string;
}

class SEOSectionDto {
  @ApiPropertyOptional({
    description: 'Meta title for SEO',
    example: 'من نحن | وكالة سمارت للحلول الرقمية والبرمجية',
  })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'Meta description for SEO',
    example:
      'تعرف على وكالة سمارت: شريك تقني يساعد الشركات على بناء مواقع وتطبيقات',
  })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({
    description: 'SEO keywords',
    example: ['وكالة سمارت', 'شركة برمجة', 'تصميم مواقع'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({
    description: 'OG image URL',
    example: 'https://cloudinary.com/og-image.jpg',
  })
  @IsOptional()
  @IsUrl()
  ogImage?: string;
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
    example: 'أن تكون سمارت الشريك التقني الأقرب للشركات والمشاريع الطموحة',
  })
  @IsString()
  @IsNotEmpty({ message: 'Vision is required' })
  vision: string;

  @ApiProperty({
    description: 'Mission text',
    example:
      'مهمتنا هي مساعدة المشاريع على الانتقال من فكرة مبعثرة إلى منتج رقمي واضح',
  })
  @IsString()
  @IsNotEmpty({ message: 'Mission is required' })
  mission: string;

  @ApiProperty({
    description: 'Approach text',
    example: 'نعمل بمنهجية تبدأ بفهم الهدف والسوق والمستخدم',
  })
  @IsString()
  @IsNotEmpty({ message: 'Approach is required' })
  approach: string;

  @ApiPropertyOptional({
    description: 'Story section',
    type: StorySectionDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => StorySectionDto)
  story?: StorySectionDto;

  @ApiPropertyOptional({
    description: 'Thinking items',
    type: [ThinkingItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ThinkingItemDto)
  thinking?: ThinkingItemDto[];

  @ApiPropertyOptional({
    description: 'Differentiators',
    type: [DifferentiatorItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DifferentiatorItemDto)
  differentiators?: DifferentiatorItemDto[];

  @ApiPropertyOptional({
    description: 'Process steps',
    type: [ProcessStepDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcessStepDto)
  process?: ProcessStepDto[];

  @ApiProperty({
    description: 'Core values / principles',
    type: [PrincipleItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrincipleItemDto)
  values: PrincipleItemDto[];

  @ApiProperty({
    description: 'Statistics',
    type: [StatItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatItemDto)
  stats: StatItemDto[];

  @ApiPropertyOptional({
    description: 'Team note section',
    type: TeamNoteSectionDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TeamNoteSectionDto)
  teamNote?: TeamNoteSectionDto;

  @ApiProperty({
    description: 'Call to action section',
    type: CTASectionDto,
  })
  @ValidateNested()
  @Type(() => CTASectionDto)
  cta: CTASectionDto;

  @ApiPropertyOptional({
    description: 'SEO section',
    type: SEOSectionDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SEOSectionDto)
  seo?: SEOSectionDto;

  @ApiPropertyOptional({
    description: 'Is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
