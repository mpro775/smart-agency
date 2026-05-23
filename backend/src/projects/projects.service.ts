import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Project,
  ProjectDocument,
  ProjectCategory,
} from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilterProjectsDto } from './dto/filter-projects.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<ProjectDocument> {
    const existingProject = await this.projectModel
      .findOne({ slug: createProjectDto.slug.toLowerCase() })
      .exec();

    if (existingProject) {
      throw new ConflictException('Project with this slug already exists');
    }

    const normalizedProjectTypes = createProjectDto.projectTypes?.length
      ? createProjectDto.projectTypes
      : createProjectDto.category
        ? [createProjectDto.category]
        : [];

    const normalizedCategoryIds = createProjectDto.categoryIds?.length
      ? createProjectDto.categoryIds
      : createProjectDto.categoryId
        ? [createProjectDto.categoryId]
        : [];

    const project = new this.projectModel({
      ...createProjectDto,
      slug: createProjectDto.slug.toLowerCase(),
      projectTypes: normalizedProjectTypes,
      categoryIds: normalizedCategoryIds,
    });
    return project.save();
  }

  async findAll(
    filterDto: FilterProjectsDto,
    includeUnpublished = false,
  ): Promise<PaginatedResponseDto<ProjectDocument>> {
    const {
      page = 1,
      limit = 10,
      tech,
      category,
      projectType,
      categoryId,
      categoryIds,
      industry,
      displayVariant,
      featured,
      isFeatured,
      search,
      isPublished,
    } = filterDto;

    // Build query
    const query: any = {};

    // Only filter by isPublished if explicitly provided, or default to true for public access
    if (!includeUnpublished) {
      query.isPublished = true;
    } else if (isPublished !== undefined) {
      query.isPublished = isPublished;
    }
    // If includeUnpublished is true and isPublished is not specified, show all projects

    if (tech) {
      query.technologies = tech;
    }

    if (category) {
      query.category = category;
    }

    if (projectType) {
      query.projectTypes = projectType;
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (categoryIds) {
      const ids = categoryIds.split(',').filter(Boolean);
      if (ids.length > 0) {
        query.categoryIds = { $in: ids };
      }
    }

    if (industry) {
      query.industry = { $regex: industry, $options: 'i' };
    }

    if (displayVariant) {
      query.displayVariant = displayVariant;
    }

    // Support both 'featured' and 'isFeatured' for backward compatibility
    const featuredFilter = featured !== undefined ? featured : isFeatured;
    if (featuredFilter !== undefined) {
      query.isFeatured = featuredFilter;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await this.projectModel.countDocuments(query).exec();

    // Get paginated results
    const projectsQuery: any = this.projectModel
      .find(query)
      .populate('technologies', 'name icon category description tooltip')
      .populate('categoryId')
      .populate('categoryIds')
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!includeUnpublished) {
      projectsQuery
        .select(
          'title slug shortDescription coverImage category technologies isFeatured order createdAt',
        )
        .lean();
    }

    const projects = await projectsQuery.exec();

    return new PaginatedResponseDto(projects, total, page, limit);
  }

  async findFeatured(): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ isFeatured: true, isPublished: true })
      .populate('technologies', 'name icon category description tooltip')
      .populate('categoryId')
      .populate('categoryIds')
      .sort({ featuredOrder: 1, sortOrder: 1, createdAt: -1 })
      .limit(6)
      .exec();
  }

  async findBySlug(slug: string): Promise<ProjectDocument> {
    const project = (await this.projectModel
      .findOne({ slug: slug.toLowerCase(), isPublished: true })
      .populate('technologies', 'name icon category description tooltip')
      .populate('categoryId')
      .populate('categoryIds')
      .select(
        'title slug description shortDescription coverImage gallery category technologies clientName results challenge solution duration url seo',
      )
      .lean()
      .exec()) as ProjectDocument | null;

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findOne(id: string): Promise<ProjectDocument> {
    const project = await this.projectModel
      .findById(id)
      .populate('technologies', 'name icon category description tooltip')
      .populate('categoryId')
      .populate('categoryIds')
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findPublicById(id: string): Promise<ProjectDocument> {
    const project = (await this.projectModel
      .findOne({ _id: id, isPublished: true })
      .populate('technologies', 'name icon category description tooltip')
      .populate('categoryId')
      .populate('categoryIds')
      .select(
        'title slug description shortDescription coverImage gallery category technologies clientName results challenge solution duration url seo',
      )
      .lean()
      .exec()) as ProjectDocument | null;

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectDocument> {
    if (updateProjectDto.slug) {
      const existingProject = await this.projectModel
        .findOne({
          slug: updateProjectDto.slug.toLowerCase(),
          _id: { $ne: id },
        })
        .exec();

      if (existingProject) {
        throw new ConflictException('Project with this slug already exists');
      }
      updateProjectDto.slug = updateProjectDto.slug.toLowerCase();
    }

    const normalizedProjectTypes = updateProjectDto.projectTypes?.length
      ? updateProjectDto.projectTypes
      : updateProjectDto.category
        ? [updateProjectDto.category]
        : undefined;

    const normalizedCategoryIds = updateProjectDto.categoryIds?.length
      ? updateProjectDto.categoryIds
      : updateProjectDto.categoryId
        ? [updateProjectDto.categoryId]
        : undefined;

    const hasProjectUrl = Object.prototype.hasOwnProperty.call(
      updateProjectDto,
      'projectUrl',
    );

    const updatePayload: Record<string, unknown> = { ...updateProjectDto };

    if (normalizedProjectTypes !== undefined) {
      updatePayload.projectTypes = normalizedProjectTypes;
    }

    if (normalizedCategoryIds !== undefined) {
      updatePayload.categoryIds = normalizedCategoryIds;
    }

    const unsetPayload: Record<string, 1> = {};

    if (hasProjectUrl) {
      const urlValue = updateProjectDto.projectUrl;
      const normalizedUrl =
        typeof urlValue === 'string' ? urlValue.trim() : urlValue;

      if (!normalizedUrl) {
        delete updatePayload.projectUrl;
        unsetPayload.projectUrl = 1;
      } else {
        updatePayload.projectUrl = normalizedUrl;
      }
    }

    const finalUpdatePayload =
      Object.keys(unsetPayload).length > 0
        ? {
            $set: updatePayload,
            $unset: unsetPayload,
          }
        : updatePayload;

    const project = await this.projectModel
      .findByIdAndUpdate(id, finalUpdatePayload, { new: true })
      .populate('technologies', 'name icon category description tooltip')
      .populate('categoryId')
      .populate('categoryIds')
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async remove(id: string): Promise<void> {
    const result = await this.projectModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Project not found');
    }
  }

  async getCategories(): Promise<
    { value: string; label: string; count: number }[]
  > {
    const allCategories = Object.values(ProjectCategory);

    const categoriesWithCount = await Promise.all(
      allCategories.map(async (category) => {
        const count = await this.projectModel
          .countDocuments({
            $or: [
              { category, isPublished: true },
              { projectTypes: category, isPublished: true },
            ],
          })
          .exec();
        return {
          value: category,
          label: this.getCategoryLabel(category),
          count,
        };
      }),
    );

    return categoriesWithCount.filter((cat) => cat.count > 0);
  }

  private getCategoryLabel(category: ProjectCategory): string {
    const labels: Record<ProjectCategory, string> = {
      [ProjectCategory.WEB_APP]: 'مواقع إلكترونية',
      [ProjectCategory.MOBILE_APP]: 'تطبيقات الجوال',
      [ProjectCategory.AUTOMATION]: 'أتمتة',
      [ProjectCategory.ERP]: 'أنظمة ERP',
      [ProjectCategory.ECOMMERCE]: 'متاجر إلكترونية',
      [ProjectCategory.OTHER]: 'أخرى',
    };
    return labels[category] || category;
  }
}
