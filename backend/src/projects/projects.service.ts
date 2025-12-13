import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
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
    // Check if slug already exists
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
  ): Promise<PaginatedResponseDto<ProjectDocument>> {
    const { page = 1, limit = 10, tech, category, featured, search } = filterDto;

    // Build query
    const query: any = { isPublished: true };

    if (tech) {
      query.technologies = tech;
    }

    if (category) {
      query.category = category;
    }

    if (featured !== undefined) {
      query.isFeatured = featured;
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
    const projects = await this.projectModel
      .find(query)
      .populate('technologies', 'name icon category')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return new PaginatedResponseDto(projects, total, page, limit);
  }

  async findFeatured(): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ isFeatured: true, isPublished: true })
      .populate('technologies', 'name icon category')
      .sort({ createdAt: -1 })
      .limit(6)
      .exec();
  }

  async findBySlug(slug: string): Promise<ProjectDocument> {
    const project = await this.projectModel
      .findOne({ slug: slug.toLowerCase(), isPublished: true })
      .populate('technologies', 'name icon category')
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findOne(id: string): Promise<ProjectDocument> {
    const project = await this.projectModel
      .findById(id)
      .populate('technologies', 'name icon category')
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectDocument> {
    // If slug is being updated, check for conflicts
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

    const project = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .populate('technologies', 'name icon category')
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
}

