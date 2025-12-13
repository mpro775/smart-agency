import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MetaDto {
  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiPropertyOptional({ description: 'Pagination metadata', type: MetaDto })
  meta?: MetaDto;
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ description: 'Error message' })
  message: string;

  @ApiPropertyOptional({
    description: 'Validation errors',
    type: [String],
  })
  errors?: string[];

  @ApiProperty({ description: 'Timestamp of the error' })
  timestamp: string;

  @ApiProperty({ description: 'Request path' })
  path: string;
}

