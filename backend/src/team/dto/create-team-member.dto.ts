import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  IsNumber,
  IsEmail,
  IsUrl,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Department } from '../schemas/team-member.schema';

export class CreateTeamMemberDto {
  @ApiProperty({
    description: 'Full name',
    example: 'أحمد علي',
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiProperty({
    description: 'Job role/title',
    example: 'Senior Backend Developer',
  })
  @IsString()
  @IsNotEmpty({ message: 'Role is required' })
  role: string;

  @ApiProperty({
    description: 'Department',
    enum: Department,
    example: Department.BACKEND,
  })
  @IsEnum(Department)
  department: Department;

  @ApiPropertyOptional({
    description: 'Profile photo URL',
    example: 'https://cdn.example.com/team/ahmed.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({
    description: 'Short bio',
    example: 'مطور خبير مع 5 سنوات خبرة في تطوير تطبيقات الويب',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Fun fact or personal touch about the member',
    example: 'مدمن قهوة ☕',
  })
  @IsOptional()
  @IsString()
  funFact?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'ahmed@smartagency.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  // Social Links
  @ApiPropertyOptional({
    description: 'LinkedIn profile URL',
    example: 'https://linkedin.com/in/ahmed',
  })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiPropertyOptional({
    description: 'GitHub profile URL',
    example: 'https://github.com/ahmed',
  })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiPropertyOptional({
    description: 'Twitter profile URL',
    example: 'https://twitter.com/ahmed',
  })
  @IsOptional()
  @IsString()
  twitterUrl?: string;

  @ApiPropertyOptional({
    description: 'Personal website URL',
    example: 'https://ahmed.dev',
  })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({
    description: 'Skills and specializations',
    type: [String],
    example: ['Nest.js', 'Docker', 'AWS', 'PostgreSQL'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @ApiPropertyOptional({
    description: 'Show on homepage',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  showOnHome?: boolean;

  @ApiPropertyOptional({
    description: 'Show on about page',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  showOnAbout?: boolean;

  @ApiPropertyOptional({
    description: 'Is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Number of projects worked on',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  projectsCount?: number;

  @ApiPropertyOptional({
    description: 'Date joined the team',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  joinedAt?: Date;
}
