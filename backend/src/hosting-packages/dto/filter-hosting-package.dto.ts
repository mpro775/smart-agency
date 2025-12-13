import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PackageCategory, BillingCycle } from '../schemas/hosting-package.schema';

export class FilterHostingPackageDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by category',
    enum: PackageCategory,
  })
  @IsOptional()
  @IsEnum(PackageCategory)
  category?: PackageCategory;

  @ApiPropertyOptional({
    description: 'Filter by billing cycle',
    enum: BillingCycle,
  })
  @IsOptional()
  @IsEnum(BillingCycle)
  billingCycle?: BillingCycle;

  @ApiPropertyOptional({
    description: 'Filter active packages only',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter popular packages only',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPopular?: boolean;
}

