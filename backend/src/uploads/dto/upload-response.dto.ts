import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: 'Public URL of the uploaded file (Cloudflare R2)',
    example: 'https://assets.smartagency.com/projects/1700000000_logo.png',
  })
  url: string;

  @ApiProperty({
    description: 'Object key used to manage the file',
    example: 'smart-agency/projects/1700000000_logo.png',
  })
  publicId: string;

  @ApiProperty({
    description: 'File format inferred from the MIME type',
    example: 'png',
  })
  format: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 102400,
  })
  bytes: number;

  @ApiProperty({
    description: 'Image width (for images)',
    example: 1920,
  })
  width?: number;

  @ApiProperty({
    description: 'Image height (for images)',
    example: 1080,
  })
  height?: number;
}

