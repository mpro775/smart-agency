import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './schemas/testimonial.schema';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { PaginationDto, PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name)
    private testimonialModel: Model<TestimonialDocument>,
  ) {}

  async create(createDto: CreateTestimonialDto): Promise<TestimonialDocument> {
    const testimonial = new this.testimonialModel(createDto);
    return testimonial.save();
  }

  async findAll(
    paginationDto: PaginationDto,
    includeInactive = false,
  ): Promise<PaginatedResponseDto<TestimonialDocument>> {
    const { page = 1, limit = 10 } = paginationDto;

    const query: any = {};
    if (!includeInactive) {
      query.isActive = true;
    }

    const total = await this.testimonialModel.countDocuments(query).exec();

    const testimonials = await this.testimonialModel
      .find(query)
      .populate('linkedProject', 'title slug images')
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return new PaginatedResponseDto(testimonials, total, page, limit);
  }

  async findFeatured(): Promise<TestimonialDocument[]> {
    return this.testimonialModel
      .find({ isActive: true, isFeatured: true })
      .populate('linkedProject', 'title slug images')
      .sort({ sortOrder: 1, rating: -1 })
      .limit(6)
      .exec();
  }

  async findOne(id: string): Promise<TestimonialDocument> {
    const testimonial = await this.testimonialModel
      .findById(id)
      .populate('linkedProject', 'title slug images')
      .exec();

    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }

    return testimonial;
  }

  async findByProject(projectId: string): Promise<TestimonialDocument[]> {
    return this.testimonialModel
      .find({ linkedProject: projectId, isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateDto: UpdateTestimonialDto,
  ): Promise<TestimonialDocument> {
    const testimonial = await this.testimonialModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('linkedProject', 'title slug images')
      .exec();

    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }

    return testimonial;
  }

  async remove(id: string): Promise<void> {
    const result = await this.testimonialModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Testimonial not found');
    }
  }

  async getStats(): Promise<any> {
    const [total, active, featured, avgRating] = await Promise.all([
      this.testimonialModel.countDocuments().exec(),
      this.testimonialModel.countDocuments({ isActive: true }).exec(),
      this.testimonialModel.countDocuments({ isFeatured: true }).exec(),
      this.testimonialModel
        .aggregate([
          { $match: { isActive: true } },
          { $group: { _id: null, avgRating: { $avg: '$rating' } } },
        ])
        .exec(),
    ]);

    return {
      total,
      active,
      featured,
      averageRating: avgRating[0]?.avgRating?.toFixed(1) || '0',
    };
  }
}

