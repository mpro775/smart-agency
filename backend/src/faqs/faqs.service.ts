import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Faq, FaqDocument } from './schemas/faq.schema';
import { CreateFaqDto, UpdateFaqDto, FilterFaqDto } from './dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { getMissingEnglishFields } from '../common/localization/translation-completeness';

@Injectable()
export class FaqsService {
  constructor(@InjectModel(Faq.name) private faqModel: Model<FaqDocument>) {}

  async create(createFaqDto: CreateFaqDto): Promise<FaqDocument> {
    const missingFields = getMissingEnglishFields('faq', createFaqDto);
    if (createFaqDto.isActive !== false && missingFields.length > 0) {
      throw new BadRequestException({
        code: 'BILINGUAL_CONTENT_INCOMPLETE',
        message: 'English FAQ content must be complete before activation',
        missingFields,
      });
    }
    const faq = new this.faqModel({
      ...createFaqDto,
      categoryKey: createFaqDto.categoryKey.toLowerCase(),
    });
    return faq.save();
  }

  async findAll(
    filterDto: FilterFaqDto,
    includeInactive = false,
  ): Promise<PaginatedResponseDto<FaqDocument>> {
    const {
      page = 1,
      limit = 10,
      category,
      categoryKey,
      search,
      isActive,
    } = filterDto;

    const query: any = {};

    // By default, only show active FAQs for public access
    if (!includeInactive) {
      query.isActive = true;
    } else if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const selectedCategoryKey = categoryKey ?? category;
    if (selectedCategoryKey) {
      query.$or = [
        { categoryKey: selectedCategoryKey },
        // Transitional fallback for records that predate categoryKey.
        { category: selectedCategoryKey },
        { categoryEn: selectedCategoryKey },
      ];
    }

    if (search) {
      const searchConditions = [
        { question: { $regex: search, $options: 'i' } },
        { questionEn: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { answerEn: { $regex: search, $options: 'i' } },
      ];
      query.$and = [
        ...(query.$or ? [{ $or: query.$or }] : []),
        { $or: searchConditions },
      ];
      delete query.$or;
    }

    const total = await this.faqModel.countDocuments(query).exec();

    const faqsQuery: any = this.faqModel
      .find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!includeInactive) {
      faqsQuery
        .select(
          'question questionEn answer answerEn category categoryEn categoryKey order isActive',
        )
        .lean();
    }

    const faqs = await faqsQuery.exec();

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
      .find({
        isActive: true,
        $or: [
          { categoryKey: category },
          { category },
          { categoryEn: category },
        ],
      })
      .sort({ order: 1, createdAt: -1 })
      .exec();
  }

  async getCategories(): Promise<
    { key: string; label: string; labelEn?: string }[]
  > {
    return this.faqModel.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: { $ifNull: ['$categoryKey', '$category'] },
          label: { $first: '$category' },
          labelEn: { $first: '$categoryEn' },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, key: '$_id', label: 1, labelEn: 1 } },
    ]);
  }

  async update(id: string, updateFaqDto: UpdateFaqDto): Promise<FaqDocument> {
    const current = await this.faqModel.findById(id).lean().exec();
    if (!current) throw new NotFoundException(`FAQ with ID ${id} not found`);
    const resultingFaq = { ...current, ...updateFaqDto };
    const missingFields = getMissingEnglishFields('faq', resultingFaq);
    if (resultingFaq.isActive && missingFields.length > 0) {
      throw new BadRequestException({
        code: 'BILINGUAL_CONTENT_INCOMPLETE',
        message: 'English FAQ content must be complete before activation',
        missingFields,
      });
    }
    if (updateFaqDto.categoryKey) {
      updateFaqDto.categoryKey = updateFaqDto.categoryKey.toLowerCase();
    }
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

    if (!faq.isActive) {
      const missingFields = getMissingEnglishFields('faq', faq.toObject());
      if (missingFields.length > 0) {
        throw new BadRequestException({
          code: 'BILINGUAL_CONTENT_INCOMPLETE',
          message: 'English FAQ content must be complete before activation',
          missingFields,
        });
      }
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
