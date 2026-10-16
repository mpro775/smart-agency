import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ManagedAssetDto } from '../../common/dto/managed-asset.dto';

export class CreateTraineeDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullName: string;
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullNameEn: string;
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ManagedAssetDto)
  photo?: ManagedAssetDto | null;
  @IsOptional() @IsEmail() @MaxLength(254) email?: string;
  @IsOptional() @IsString() @MaxLength(50) phone?: string;
  @IsOptional()
  @IsUrl({ protocols: ['https', 'http'], require_protocol: true })
  linkedinUrl?: string;
  @IsOptional()
  @IsUrl({ protocols: ['https', 'http'], require_protocol: true })
  githubUrl?: string;
  @IsOptional()
  @IsUrl({ protocols: ['https', 'http'], require_protocol: true })
  portfolioUrl?: string;
  @IsOptional() @IsBoolean() publicPhotoAllowed?: boolean;
  @IsOptional() @IsBoolean() publicProfessionalLinksAllowed?: boolean;
  @IsOptional() @IsString() @MaxLength(5000) notes?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
