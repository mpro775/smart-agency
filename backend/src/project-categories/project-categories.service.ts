import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProjectCategory,
  ProjectCategoryDocument,
} from './schemas/project-category.schema';
import { CreateProjectCategoryDto } from './dto/create-project-category.dto';
import { UpdateProjectCategoryDto } from './dto/update-project-category.dto';

@Injectable()
export class ProjectCategoriesService {
  constructor(
    @InjectModel(ProjectCategory.name)
    private categoryModel: Model<ProjectCategoryDocument>,
  ) {}

  async create(
    createCategoryDto: CreateProjectCategoryDto,
  ): Promise<ProjectCategoryDocument> {
    // Check if value already exists
    const existingCategory = await this.categoryModel
      .findOne({ value: createCategoryDto.value })
      .exec();

    if (existingCategory) {
      throw new ConflictException('Category with this value already exists');
    }

    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async findAll(): Promise<ProjectCategoryDocument[]> {
    return this.categoryModel
      .find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findActive(): Promise<ProjectCategoryDocument[]> {
    return this.categoryModel
      .find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<ProjectCategoryDocument> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findByValue(value: string): Promise<ProjectCategoryDocument> {
    const category = await this.categoryModel.findOne({ value }).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateProjectCategoryDto,
  ): Promise<ProjectCategoryDocument> {
    // Check if value already exists (excluding current category)
    if (updateCategoryDto.value) {
      const existingCategory = await this.categoryModel
        .findOne({ value: updateCategoryDto.value, _id: { $ne: id } })
        .exec();

      if (existingCategory) {
        throw new ConflictException('Category with this value already exists');
      }
    }

    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Category not found');
    }
  }
}
