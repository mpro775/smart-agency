import {
  Injectable,
  BadRequestException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { UploadResponseDto } from './dto/upload-response.dto';
import sharp from 'sharp';

export interface UploadOptions {
  folder?: string;
}

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly defaultFolder = 'smart-agency';
  private readonly bucketName?: string;
  private readonly publicBaseUrl?: string;
  private readonly s3Client?: S3Client;
  private readonly isStorageConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('R2_ENDPOINT');
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'R2_SECRET_ACCESS_KEY',
    );
    const bucketName = this.configService.get<string>('R2_BUCKET_NAME');

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
      this.isStorageConfigured = false;
      this.logger.warn(
        'R2 storage is not configured. Upload endpoints will fail until env vars are provided.',
      );
      return;
    }

    this.isStorageConfigured = true;

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
    this.publicBaseUrl = this.normalizeBaseUrl(
      customDomain ||
        (endpointHost
          ? `https://${this.bucketName}.${endpointHost}`
          : endpoint),
    );
  }

  async uploadFile(
    file: Express.Multer.File,
    options: UploadOptions = {},
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    this.assertStorageConfigured();

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

    const MAX_ORIGINAL_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB
    if (file.size > MAX_ORIGINAL_IMAGE_SIZE) {
      throw new BadRequestException('File size must be less than 15MB before compression');
    }

    let fileBuffer = file.buffer;
    let mimeType = file.mimetype;
    let fileName = file.originalname;
    let width: number | undefined;
    let height: number | undefined;

    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      try {
        const { data, info } = await sharp(file.buffer)
          .resize({
            width: 1920,
            height: 1920,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 82 })
          .toBuffer({ resolveWithObject: true });
          
        fileBuffer = data;
        width = info.width;
        height = info.height;
        mimeType = 'image/webp';
        fileName = fileName.replace(/\.[^/.]+$/, '') + '.webp';
      } catch (err) {
        this.logger.error('Error processing image with sharp', err);
        throw new BadRequestException('Failed to process image');
      }
    } else {
      try {
        const metadata = await sharp(file.buffer).metadata();
        width = metadata.width;
        height = metadata.height;
      } catch (err) {
        this.logger.warn(`Could not extract metadata for ${fileName}`);
      }
    }

    const MAX_OPTIMIZED_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
    if (fileBuffer.length > MAX_OPTIMIZED_IMAGE_SIZE) {
      throw new BadRequestException('File size after compression is still too large (exceeds 3MB)');
    }

    const key = this.buildObjectKey(fileName, options.folder);

    try {
      const upload: Upload = new Upload({
        client: this.s3Client!,
        params: {
          Bucket: this.bucketName!,
          Key: key,
          Body: fileBuffer,
          ContentType: mimeType,
          CacheControl: 'public, max-age=31536000, immutable',
        },
      });

      await upload.done();

      return {
        url: this.buildPublicUrl(key),
        publicId: key,
        format: mimeType.split('/')[1] || 'bin',
        bytes: fileBuffer.length,
        width,
        height,
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
    this.assertStorageConfigured();

    try {
      await this.s3Client!.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName!,
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
    this.assertStorageConfigured();

    try {
      await this.s3Client!.send(
        new DeleteObjectsCommand({
          Bucket: this.bucketName!,
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

  private assertStorageConfigured(): void {
    if (!this.isStorageConfigured || !this.s3Client || !this.bucketName) {
      throw new ServiceUnavailableException(
        'File upload storage is not configured',
      );
    }
  }

  private normalizeBaseUrl(url: string): string {
    return url.replace(/\/$/, '');
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
