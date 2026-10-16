import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  CertificateStatus,
  CertificateType,
} from '../schemas/certificate.schema';
export class FilterCertificatesDto extends PaginationDto {
  @IsOptional() @IsString() @MaxLength(200) search?: string;
  @IsOptional() @IsEnum(CertificateStatus) status?: CertificateStatus;
  @IsOptional() @IsEnum(CertificateType) type?: CertificateType;
  @IsOptional() @IsMongoId() traineeId?: string;
  @IsOptional() @IsDateString() from?: string;
  @IsOptional() @IsDateString() until?: string;
}
