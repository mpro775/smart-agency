import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  HostingPackage,
  HostingPackageDocument,
} from './schemas/hosting-package.schema';
import { CreateHostingPackageDto } from './dto/create-hosting-package.dto';
import { UpdateHostingPackageDto } from './dto/update-hosting-package.dto';
import { FilterHostingPackageDto } from './dto/filter-hosting-package.dto';
import { CreatePackageSelectionDto } from './dto/create-package-selection.dto';
import { LeadsService } from '../leads/leads.service';
import { ServiceType } from '../leads/schemas/lead.schema';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class HostingPackagesService {
  constructor(
    @InjectModel(HostingPackage.name)
    private hostingPackageModel: Model<HostingPackageDocument>,
    @Inject(forwardRef(() => LeadsService))
    private leadsService: LeadsService,
  ) {}

  async create(
    createDto: CreateHostingPackageDto,
  ): Promise<HostingPackageDocument> {
    const hostingPackage = new this.hostingPackageModel(createDto);
    return hostingPackage.save();
  }

  async findAll(
    filterDto: FilterHostingPackageDto,
    includeInactive = false,
  ): Promise<PaginatedResponseDto<HostingPackageDocument>> {
    const { page = 1, limit = 10, category, billingCycle, isActive, isPopular } = filterDto;

    // Build query
    const query: any = {};

    if (!includeInactive) {
      query.isActive = true;
    } else if (isActive !== undefined) {
      query.isActive = isActive;
    }

    if (category) {
      query.category = category;
    }

    if (billingCycle) {
      query.billingCycle = billingCycle;
    }

    if (isPopular !== undefined) {
      query.isPopular = isPopular;
    }

    // Get total count
    const total = await this.hostingPackageModel.countDocuments(query).exec();

    // Get paginated results
    const packages = await this.hostingPackageModel
      .find(query)
      .sort({ sortOrder: 1, price: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return new PaginatedResponseDto(packages, total, page, limit);
  }

  async findByCategory(category: string): Promise<HostingPackageDocument[]> {
    return this.hostingPackageModel
      .find({ category, isActive: true })
      .sort({ sortOrder: 1, price: 1 })
      .exec();
  }

  async findOne(id: string): Promise<HostingPackageDocument> {
    const hostingPackage = await this.hostingPackageModel.findById(id).exec();

    if (!hostingPackage) {
      throw new NotFoundException('Hosting package not found');
    }

    return hostingPackage;
  }

  async update(
    id: string,
    updateDto: UpdateHostingPackageDto,
  ): Promise<HostingPackageDocument> {
    const hostingPackage = await this.hostingPackageModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!hostingPackage) {
      throw new NotFoundException('Hosting package not found');
    }

    return hostingPackage;
  }

  async remove(id: string): Promise<void> {
    const result = await this.hostingPackageModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Hosting package not found');
    }
  }

  async updateSortOrder(
    packages: { id: string; sortOrder: number }[],
  ): Promise<void> {
    const bulkOps = packages.map((pkg) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(pkg.id) },
        update: { $set: { sortOrder: pkg.sortOrder } },
      },
    }));

    await this.hostingPackageModel.bulkWrite(bulkOps);
  }

  async handlePackageSelection(
    packageId: string,
    createPackageSelectionDto: CreatePackageSelectionDto,
  ): Promise<{ message: string }> {
    // Validate package exists and is active
    const hostingPackage = await this.findOne(packageId);
    if (!hostingPackage.isActive) {
      throw new NotFoundException('Selected package is not available');
    }

    // Create lead with package selection information
    const leadData = {
      fullName: createPackageSelectionDto.fullName,
      companyName: createPackageSelectionDto.companyName,
      email: createPackageSelectionDto.email,
      phone: createPackageSelectionDto.phone,
      serviceType: ServiceType.OTHER, // Use OTHER since we don't have a specific HOSTING type
      message: `Hosting Package Selection: ${hostingPackage.name} (${createPackageSelectionDto.billingCycle})\n\n${createPackageSelectionDto.message || ''}`,
      source: `Hosting Package Selection - ${hostingPackage.name}`,
    };

    await this.leadsService.create(leadData);

    return {
      message: 'Thank you for your interest! We will contact you soon.',
    };
  }
}

