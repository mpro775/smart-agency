import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
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
import { LeadType, ServiceType } from '../leads/schemas/lead.schema';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { getMissingEnglishFields } from '../common/localization/translation-completeness';

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
    const missingFields = getMissingEnglishFields('hosting', createDto);
    if (createDto.isActive !== false && missingFields.length > 0) {
      throw new BadRequestException({
        code: 'BILINGUAL_CONTENT_INCOMPLETE',
        message: 'English hosting content must be complete before activation',
        missingFields,
      });
    }
    const hostingPackage = new this.hostingPackageModel(createDto);
    return hostingPackage.save();
  }

  async findAll(
    filterDto: FilterHostingPackageDto,
    includeInactive = false,
  ): Promise<PaginatedResponseDto<HostingPackageDocument>> {
    const {
      page = 1,
      limit = 10,
      category,
      billingCycle,
      isActive,
      isPopular,
    } = filterDto;

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
    const packagesQuery: any = this.hostingPackageModel
      .find(query)
      .sort({ sortOrder: 1, price: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!includeInactive) {
      packagesQuery
        .select(
          'name nameEn slug description descriptionEn price currency originalPrice billingCycle category features featuresEn isPopular isBestValue isActive storage storageEn bandwidth bandwidthEn ram ramEn cpu cpuEn domains domainsEn yearlyPrice benefitHints benefitHintsEn sortOrder',
        )
        .lean();
    }

    const packages = await packagesQuery.exec();

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
    const current = await this.hostingPackageModel.findById(id).lean().exec();
    if (!current) throw new NotFoundException('Hosting package not found');
    const resultingPackage = { ...current, ...updateDto };
    const missingFields = getMissingEnglishFields('hosting', resultingPackage);
    if (resultingPackage.isActive && missingFields.length > 0) {
      throw new BadRequestException({
        code: 'BILINGUAL_CONTENT_INCOMPLETE',
        message: 'English hosting content must be complete before activation',
        missingFields,
      });
    }
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
      leadType: LeadType.PACKAGE_REQUEST,
      locale: createPackageSelectionDto.locale ?? 'ar',
    };

    await this.leadsService.create(leadData);

    return {
      message: 'Thank you for your interest! We will contact you soon.',
    };
  }
}
