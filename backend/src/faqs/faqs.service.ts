import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Faq, FaqDocument } from './schemas/faq.schema';
import { CreateFaqDto, UpdateFaqDto, FilterFaqDto } from './dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class FaqsService {
  constructor(@InjectModel(Faq.name) private faqModel: Model<FaqDocument>) {}

  async create(createFaqDto: CreateFaqDto): Promise<FaqDocument> {
    const faq = new this.faqModel(createFaqDto);
    return faq.save();
  }

  async findAll(
    filterDto: FilterFaqDto,
    includeInactive = false,
  ): Promise<PaginatedResponseDto<FaqDocument>> {
    const { page = 1, limit = 10, category, search, isActive } = filterDto;

    const query: any = {};

    // By default, only show active FAQs for public access
    if (!includeInactive) {
      query.isActive = true;
    } else if (isActive !== undefined) {
      query.isActive = isActive;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await this.faqModel.countDocuments(query).exec();

    const faqs = await this.faqModel
      .find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return new PaginatedResponseDto(faqs, total, page, limit);
  }

  async findOne(id: string): Promise<FaqDocument> {
    const faq = await this.faqModel.findById(id).exec();
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return faq;
  }

  async findByCategory(category: string): Promise<FaqDocument[]> {
    return this.faqModel
      .find({ category, isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .exec();
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.faqModel.distinct('category', {
      isActive: true,
    });
    return categories;
  }

  async update(id: string, updateFaqDto: UpdateFaqDto): Promise<FaqDocument> {
    const faq = await this.faqModel
      .findByIdAndUpdate(id, updateFaqDto, { new: true })
      .exec();

    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return faq;
  }

  async remove(id: string): Promise<FaqDocument> {
    const faq = await this.faqModel.findByIdAndDelete(id).exec();
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return faq;
  }

  async toggleActive(id: string): Promise<FaqDocument> {
    const faq = await this.faqModel.findById(id).exec();
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    faq.isActive = !faq.isActive;
    return faq.save();
  }

  async reorder(ids: string[]): Promise<void> {
    const bulkOps = ids.map((id, index) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id) },
        update: { $set: { order: index } },
      },
    }));

    await this.faqModel.bulkWrite(bulkOps);
  }
}
