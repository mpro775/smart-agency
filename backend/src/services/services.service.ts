import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FilterServiceDto } from './dto/filter-service.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<ServiceDocument> {
    // Generate slug if not provided
    if (!createServiceDto.slug) {
      createServiceDto.slug = this.generateSlug(createServiceDto.title);
    }

    // Check if slug already exists
    const existingService = await this.serviceModel
      .findOne({ slug: createServiceDto.slug })
      .exec();

    if (existingService) {
      throw new ConflictException('Service with this slug already exists');
    }

    const service = new this.serviceModel(createServiceDto);
    return service.save();
  }

  async findAll(
    filterDto: FilterServiceDto,
  ): Promise<PaginatedResponseDto<ServiceDocument>> {
    const { page = 1, limit = 10, isActive, search } = filterDto;

    // Build query
    const query: any = {};

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await this.serviceModel.countDocuments(query).exec();

    // Get paginated results
    const services = await this.serviceModel
      .find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return new PaginatedResponseDto(services, total, page, limit);
  }

  async findActive(): Promise<ServiceDocument[]> {
    return this.serviceModel
      .find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<ServiceDocument> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async findBySlug(slug: string): Promise<ServiceDocument> {
    const service = await this.serviceModel.findOne({ slug }).exec();
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceDocument> {
    // Generate slug if title is updated and slug is not provided
    if (updateServiceDto.title && !updateServiceDto.slug) {
      updateServiceDto.slug = this.generateSlug(updateServiceDto.title);
    }

    // Check if slug already exists (excluding current service)
    if (updateServiceDto.slug) {
      const existingService = await this.serviceModel
        .findOne({ slug: updateServiceDto.slug, _id: { $ne: id } })
        .exec();

      if (existingService) {
        throw new ConflictException('Service with this slug already exists');
      }
    }

    const service = await this.serviceModel
      .findByIdAndUpdate(id, updateServiceDto, { new: true })
      .exec();

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async remove(id: string): Promise<void> {
    const result = await this.serviceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Service not found');
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
