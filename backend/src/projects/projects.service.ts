import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import {
  ProjectCategory as ProjectCategoryModel,
  ProjectCategoryDocument,
} from '../project-categories/schemas/project-category.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilterProjectsDto } from './dto/filter-projects.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { getMissingEnglishFields } from '../common/localization/translation-completeness';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(ProjectCategoryModel.name)
    private categoryModel: Model<ProjectCategoryDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<ProjectDocument> {
    const missingFields = getMissingEnglishFields('project', createProjectDto);
    if (createProjectDto.isPublished !== false && missingFields.length > 0) {
      throw new BadRequestException({
        code: 'BILINGUAL_CONTENT_INCOMPLETE',
        message:
          'English project content and SEO must be complete before publishing',
        missingFields,
      });
    }
    const existingProject = await this.projectModel
      .findOne({ slug: createProjectDto.slug.toLowerCase() })
      .exec();

    if (existingProject) {
      throw new ConflictException('Project with this slug already exists');
    }

    const project = new this.projectModel({
      ...createProjectDto,
      slug: createProjectDto.slug.toLowerCase(),
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
      categoryIds,
      industry,
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

    if (tech) {
      query.technologies = tech;
    }

    if (categoryIds) {
      const ids = categoryIds.split(',').filter(Boolean);
      if (ids.length > 0) {
        query.categoryIds = { $in: ids };
      }
    }

    if (industry) {
      query.$and = [
        ...(query.$and ?? []),
        {
          $or: [
            { industry: { $regex: industry, $options: 'i' } },
            { industryEn: { $regex: industry, $options: 'i' } },
          ],
        },
      ];
    }

    // Support both 'featured' and 'isFeatured' for backward compatibility
    const featuredFilter = featured !== undefined ? featured : isFeatured;
    if (featuredFilter !== undefined) {
      query.isFeatured = featuredFilter;
    }

    if (search) {
      const searchOr = [
        { title: { $regex: search, $options: 'i' } },
        { titleEn: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { summaryEn: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { industryEn: { $regex: search, $options: 'i' } },
      ];
      if (query.$or || query.$and) {
        if (query.$and) {
          query.$and.push({ $or: searchOr });
        } else {
          query.$and = [
            ...(query.$or ? [{ $or: query.$or }] : []),
            { $or: searchOr },
          ];
          delete query.$or;
        }
      } else {
        query.$or = searchOr;
      }
    }

    // Get total count
    const total = await this.projectModel.countDocuments(query).exec();

    // Get paginated results
    const projectsQuery: any = this.projectModel
      .find(query)
      .populate(
        'technologies',
        'name icon category description descriptionEn tooltip tooltipEn',
      )
      .populate('categoryIds')
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!includeUnpublished) {
      projectsQuery
        .select(
          'title titleEn slug summary summaryEn shortDescription images categoryIds industry industryEn year technologies isFeatured order createdAt results stats clientName clientNameEn clientLogo projectUrl',
        )
        .lean();
    }

    const projects = await projectsQuery.exec();

    return new PaginatedResponseDto(projects, total, page, limit);
  }

  async findFeatured(): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ isFeatured: true, isPublished: true })
      .populate(
        'technologies',
        'name icon category description descriptionEn tooltip tooltipEn',
      )
      .populate('categoryIds')
      .sort({ featuredOrder: 1, sortOrder: 1, createdAt: -1 })
      .limit(6)
      .exec();
  }

  async findBySlug(slug: string): Promise<ProjectDocument> {
    const project = (await this.projectModel
      .findOne({ slug: slug.toLowerCase(), isPublished: true })
      .populate(
        'technologies',
        'name icon category description descriptionEn tooltip tooltipEn',
      )
      .populate('categoryIds')
      .select(
        'title titleEn slug summary summaryEn challenge challengeEn solution solutionEn results features featuresEn images technologies clientName clientNameEn clientLogo categoryIds industry industryEn duration durationEn year videoUrl stats projectUrl isFeatured seo',
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
      .populate(
        'technologies',
        'name icon category description descriptionEn tooltip tooltipEn',
      )
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
      .populate(
        'technologies',
        'name icon category description descriptionEn tooltip tooltipEn',
      )
      .populate('categoryIds')
      .select(
        'title titleEn slug summary summaryEn challenge challengeEn solution solutionEn results features featuresEn images technologies clientName clientNameEn clientLogo categoryIds industry industryEn duration durationEn year videoUrl stats projectUrl isFeatured seo',
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
    const currentProject = await this.projectModel.findById(id).lean().exec();
    if (!currentProject) throw new NotFoundException('Project not found');

    const resultingProject = {
      ...(currentProject as unknown as CreateProjectDto),
      ...updateProjectDto,
      seo: {
        ...(currentProject.seo as Record<string, unknown>),
        ...updateProjectDto.seo,
      },
    };
    const missingFields = getMissingEnglishFields('project', resultingProject);
    if (resultingProject.isPublished && missingFields.length > 0) {
      throw new BadRequestException({
        code: 'BILINGUAL_CONTENT_INCOMPLETE',
        message:
          'English project content and SEO must be complete before publishing',
        missingFields,
      });
    }
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

    const hasProjectUrl = Object.prototype.hasOwnProperty.call(
      updateProjectDto,
      'projectUrl',
    );

    const updatePayload: Record<string, unknown> = { ...updateProjectDto };

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
      .populate(
        'technologies',
        'name icon category description descriptionEn tooltip tooltipEn',
      )
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
    { _id: string; key: string; name: string; nameEn?: string; count: number }[]
  > {
    // Get categories from the database collection
    const dbCategories = await this.categoryModel
      .find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean()
      .exec();

    const categoriesWithCount = await Promise.all(
      dbCategories.map(async (cat) => {
        const count = await this.projectModel
          .countDocuments({
            categoryIds: cat._id,
            isPublished: true,
          })
          .exec();
        return {
          _id: cat._id.toString(),
          key: cat.value,
          name: cat.label,
          nameEn: cat.labelEn,
          count,
        };
      }),
    );

    return categoriesWithCount;
  }
}
