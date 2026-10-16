import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { ManagedAssetDto } from '../../common/dto/managed-asset.dto';
import { CertificateType } from '../schemas/certificate.schema';

export class CertificateSkillDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;
  @IsOptional() @IsString() @MaxLength(120) nameEn?: string;
}
export class CreateCertificateDto {
  @IsMongoId() traineeId: string;
  @IsEnum(CertificateType) type: CertificateType;
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @Matches(/^[A-Z0-9]{2,8}$/, {
    message: 'INVALID_PROGRAM_CODE: use 2–8 letters or digits',
  })
  programCode: string;
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title: string;
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  titleEn: string;
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  specialization: string;
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  specializationEn: string;
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  supervisorName: string;
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  supervisorTitle: string;
  @IsOptional() @IsString() @MaxLength(5000) durationLabel?: string;
  @IsOptional() @IsString() @MaxLength(5000) durationLabelEn?: string;
  @IsOptional() @IsString() @MaxLength(5000) description?: string;
  @IsOptional() @IsString() @MaxLength(5000) descriptionEn?: string;
  @IsOptional() @IsString() @MaxLength(5000) supervisorNameEn?: string;
  @IsOptional() @IsString() @MaxLength(5000) supervisorTitleEn?: string;
  @IsDateString() trainingStartDate: string;
  @IsDateString() trainingEndDate: string;
  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => CertificateSkillDto)
  skills?: CertificateSkillDto[];
  @IsOptional() @IsBoolean() publicPhotoVisible?: boolean;
  @IsOptional() @IsBoolean() publicProfessionalLinksVisible?: boolean;
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ManagedAssetDto)
  certificateImage?: ManagedAssetDto | null;
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ManagedAssetDto)
  certificatePdf?: ManagedAssetDto | null;
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @Matches(/^SA-(INT|PTR|EXP|CRS)-[A-Z0-9]{2,8}-\d{4}-[A-F0-9]{8,10}$/)
  supersedesCertificateId?: string;
}
