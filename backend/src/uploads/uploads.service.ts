import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { UploadResponseDto } from './dto/upload-response.dto';

export interface UploadOptions {
  folder?: string;
}

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly defaultFolder = 'smart-agency';
  private readonly bucketName: string;
  private readonly publicBaseUrl: string;
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.getOrThrow<string>('R2_ENDPOINT');
    const accessKeyId =
      this.configService.getOrThrow<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.getOrThrow<string>(
      'R2_SECRET_ACCESS_KEY',
    );
    const bucketName = this.configService.getOrThrow<string>('R2_BUCKET_NAME');

    this.bucketName = bucketName;

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const customDomain =
      this.configService.get<string>('R2_PUBLIC_DOMAIN') || undefined;
    const endpointHost = this.getEndpointHost(endpoint);
    this.publicBaseUrl =
      customDomain ||
      (endpointHost ? `https://${this.bucketName}.${endpointHost}` : endpoint);
  }

  async uploadFile(
    file: Express.Multer.File,
    options: UploadOptions = {},
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP, SVG',
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    const key = this.buildObjectKey(file.originalname, options.folder);

    try {
      const upload: Upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        },
      });

      await upload.done();

      return {
        url: this.buildPublicUrl(key),
        publicId: key,
        format: this.extractFormat(file),
        bytes: file.size,
      };
    } catch (error) {
      const message = this.getErrorMessage(error);
      this.logger.error(`Failed to upload file: ${message}`);
      throw new BadRequestException('Failed to upload file');
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    options: UploadOptions = {},
  ): Promise<UploadResponseDto[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, options));
    return Promise.all(uploadPromises);
  }

  async deleteFile(publicId: string): Promise<boolean> {
    if (!publicId) {
      throw new BadRequestException('Public ID is required');
    }

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: publicId,
        }),
      );
      return true;
    } catch (error) {
      const message = this.getErrorMessage(error);
      this.logger.error(`Failed to delete file ${publicId}: ${message}`);
      throw new BadRequestException('Failed to delete file');
    }
  }

  async deleteMultipleFiles(publicIds: string[]): Promise<void> {
    if (!publicIds?.length) {
      return;
    }

    try {
      await this.s3Client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucketName,
          Delete: {
            Objects: publicIds.map((key) => ({ Key: key })),
          },
        }),
      );
    } catch (error) {
      const message = this.getErrorMessage(error);
      this.logger.error(`Failed to delete files: ${message}`);
      throw new BadRequestException('Failed to delete files');
    }
  }

  private buildObjectKey(filename: string, folder?: string): string {
    const sanitizedName = filename.replace(/\s+/g, '_');
    const prefix = folder || this.defaultFolder;
    return `${prefix}/${Date.now()}_${sanitizedName}`;
  }

  private buildPublicUrl(key: string): string {
    return `${this.publicBaseUrl}/${key}`;
  }

  private extractFormat(file: Express.Multer.File): string {
    const [, subtype] = (file.mimetype || '').split('/');
    return subtype || 'bin';
  }

  private getEndpointHost(endpoint: string): string | null {
    try {
      return new URL(endpoint).host;
    } catch {
      return null;
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'Unknown error';
  }
}
