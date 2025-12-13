import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseMessage } from '../common/decorators';
import { UploadResponseDto } from './dto/upload-response.dto';

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiQuery({
    name: 'folder',
    required: false,
    description: 'R2 folder/prefix (e.g., projects, blog)',
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Image uploaded successfully')
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.uploadsService.uploadFile(file, {
      folder: folder ? `smart-agency/${folder}` : undefined,
    });
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Upload multiple images (max 10)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiQuery({
    name: 'folder',
    required: false,
    description: 'R2 folder/prefix (e.g., projects, blog)',
  })
  @ApiResponse({
    status: 201,
    description: 'Images uploaded successfully',
    type: [UploadResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid files' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Images uploaded successfully')
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    return this.uploadsService.uploadMultipleFiles(files, {
      folder: folder ? `smart-agency/${folder}` : undefined,
    });
  }

  @Delete(':publicId')
  @ApiOperation({ summary: 'Delete an uploaded file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 400, description: 'Failed to delete file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('File deleted successfully')
  async deleteFile(@Param('publicId') publicId: string) {
    const decodedPublicId = decodeURIComponent(publicId);
    const result = await this.uploadsService.deleteFile(decodedPublicId);
    return { deleted: result };
  }
}

