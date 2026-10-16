import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ManagedAssetDto {
  @IsUrl({ protocols: ['https', 'http'], require_protocol: true }) url: string;
  @IsString() @Matches(/^[A-Za-z0-9_./-]+$/) @MaxLength(600) publicId: string;
  @IsString() @MaxLength(100) mimeType: string;
  @IsInt() @Min(1) @Max(15 * 1024 * 1024) bytes: number;
  @IsOptional() @IsString() @MaxLength(255) originalName?: string;
  @IsOptional() @Matches(/^[a-f0-9]{64}$/) sha256?: string;
  @IsOptional() @IsInt() @Min(1) width?: number;
  @IsOptional() @IsInt() @Min(1) height?: number;
}
