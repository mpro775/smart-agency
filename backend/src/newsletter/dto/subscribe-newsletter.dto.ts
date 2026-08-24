import { IsEmail, IsOptional, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscribeNewsletterDto {
  @ApiProperty({
    description: 'Email address for newsletter subscription',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Source of the subscription',
    example: 'footer',
    required: false,
    enum: ['footer', 'blog', 'homepage', 'popup'],
    default: 'footer',
  })
  @IsOptional()
  @IsString()
  @IsIn(['footer', 'blog', 'homepage', 'popup'], {
    message: 'Source must be one of: footer, blog, homepage, popup',
  })
  source?: string;

  @ApiProperty({
    description: 'Language locale',
    example: 'en',
    required: false,
    enum: ['ar', 'en'],
    default: 'ar',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ar', 'en'])
  locale?: 'ar' | 'en';
}

export class NewsletterResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Thank you for subscribing to our newsletter!',
  })
  message: string;

  @ApiProperty({
    description: 'Subscription status',
    example: true,
  })
  success: boolean;
}
