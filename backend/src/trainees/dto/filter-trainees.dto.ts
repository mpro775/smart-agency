import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
export class FilterTraineesDto extends PaginationDto {
  @IsOptional() @IsString() @MaxLength(200) search?: string;
  @IsOptional()
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) =>
    obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key],
  )
  @IsBoolean()
  isActive?: boolean;
}
