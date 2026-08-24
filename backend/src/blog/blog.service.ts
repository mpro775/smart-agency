import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FilterBlogDto } from './dto/filter-blog.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import type { SupportedLocale } from '../common/localization/locale';
import { getMissingEnglishFields } from '../common/localization/translation-completeness';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  private calculateReadingTime(content: string): number {
    if (!content) return 1;
    const plainText = content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const words = plainText.split(' ').filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  async create(
    createBlogDto: CreateBlogDto,
    authorId: string,
  ): Promise<BlogDocument> {
    const missingFields = getMissingEnglishFields('blog', createBlogDto);
    if (createBlogDto.isPublished && missingFields.length > 0) {
      throw new BadRequestException({
        code: 'BILINGUAL_CONTENT_INCOMPLETE',
        message:
          'English blog content and SEO must be complete before publishing',
        missingFields,
      });
    }
    // Check if slug already exists
    const existingBlog = await this.blogModel
      .findOne({ slug: createBlogDto.slug.toLowerCase() })
      .exec();

    if (existingBlog) {
      throw new ConflictException('Blog post with this slug already exists');
    }

    const blog = new this.blogModel({
      ...createBlogDto,
      slug: createBlogDto.slug.toLowerCase(),
      author: authorId,
      category: createBlogDto.category,
      categoryKey: createBlogDto.categoryKey.toLowerCase(),
      contentType: createBlogDto.contentType || 'article',
      readingTime:
        createBlogDto.readingTime ||
        this.calculateReadingTime(createBlogDto.content),
      publishedAt: createBlogDto.isPublished ? new Date() : null,
    });

    return blog.save();
  }

  async findAll(
    filterDto: FilterBlogDto,
    includeUnpublished = false,
  ): Promise<PaginatedResponseDto<BlogDocument>> {
    const {
      page = 1,
      limit = 10,
      tag,
      category,
      categoryKey,
      contentType,
      search,
      isPublished,
      isFeatured,
      sort = 'latest',
    } = filterDto;

    // Build query
    const query: any = {};

    if (!includeUnpublished) {
      query.isPublished = true;
    } else if (isPublished !== undefined) {
      query.isPublished = isPublished;
    }

    if (tag) {
      query.$and = [{ $or: [{ tags: tag }, { tagsEn: tag }] }];
    }

    const selectedCategoryKey = categoryKey ?? category;
    if (selectedCategoryKey) {
      query.$and = [
        ...(query.$and ?? []),
        {
          $or: [
            { categoryKey: selectedCategoryKey },
            // Transitional fallback for records that predate categoryKey.
            { category: selectedCategoryKey },
            { categoryEn: selectedCategoryKey },
          ],
        },
      ];
    }

    if (contentType) {
      query.contentType = contentType;
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleEn: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { excerptEn: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { contentEn: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { tagsEn: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { categoryEn: { $regex: search, $options: 'i' } },
      ];
    }

    let sortQuery: any = { publishedAt: -1, createdAt: -1 };
    if (sort === 'popular') {
      sortQuery = { views: -1, publishedAt: -1 };
    }
    if (sort === 'featured') {
      sortQuery = { featuredOrder: 1, publishedAt: -1 };
    }

    // Get total count
    const total = await this.blogModel.countDocuments(query).exec();

    // Get paginated results
    const blogsQuery: any = this.blogModel
      .find(query)
      .populate('author', 'name email')
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    if (!includeUnpublished) {
      blogsQuery
        .select(
          'title titleEn slug excerpt excerptEn coverImage coverAlt coverAltEn category categoryEn categoryKey tags tagsEn readingTime publishedAt isFeatured',
        )
        .lean();
    }

    const blogs = await blogsQuery.exec();

    return new PaginatedResponseDto(blogs, total, page, limit);
  }

  async findBySlug(slug: string): Promise<BlogDocument> {
    const blog = (await this.blogModel
      .findOne({ slug: slug.toLowerCase(), isPublished: true })
      .populate('author', 'name email')
      .select(
        'title titleEn slug excerpt excerptEn content contentEn coverImage coverAlt coverAltEn category categoryEn categoryKey tags tagsEn readingTime publishedAt authorName authorNameEn authorRole authorRoleEn authorAvatar summaryPoints summaryPointsEn ctaTitle ctaTitleEn ctaDescription ctaDescriptionEn ctaButtonText ctaButtonTextEn ctaButtonUrl seo',
      )
      .lean()
      .exec()) as BlogDocument | null;

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    // Increment views
    await this.blogModel.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    return blog;
  }

  async findOne(id: string): Promise<BlogDocument> {
    const blog = await this.blogModel
      .findById(id)
      .populate('author', 'name email')
      .exec();

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    return blog;
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogDocument> {
    // If slug is being updated, check for conflicts
    if (updateBlogDto.slug) {
      const existingBlog = await this.blogModel
        .findOne({
          slug: updateBlogDto.slug.toLowerCase(),
          _id: { $ne: id },
        })
        .exec();

      if (existingBlog) {
        throw new ConflictException('Blog post with this slug already exists');
      }
      updateBlogDto.slug = updateBlogDto.slug.toLowerCase();
    }

    // Set publishedAt if publishing for the first time
    const currentBlog = await this.blogModel.findById(id).exec();
    const updateData: any = { ...updateBlogDto };

    const currentBlogObject = currentBlog?.toObject() as
      | CreateBlogDto
      | undefined;
    const resultingBlog = currentBlogObject
      ? {
          ...currentBlogObject,
          ...updateBlogDto,
          seo: { ...currentBlogObject.seo, ...updateBlogDto.seo },
        }
      : updateBlogDto;
    const missingFields = getMissingEnglishFields('blog', resultingBlog);
    if (resultingBlog.isPublished && missingFields.length > 0) {
      throw new BadRequestException({
        code: 'BILINGUAL_CONTENT_INCOMPLETE',
        message:
          'English blog content and SEO must be complete before publishing',
        missingFields,
      });
    }

    if (updateBlogDto.content && !updateBlogDto.readingTime) {
      updateData.readingTime = this.calculateReadingTime(updateBlogDto.content);
    }

    if (updateBlogDto.categoryKey) {
      updateData.categoryKey = updateBlogDto.categoryKey.toLowerCase();
    }

    if (updateBlogDto.isPublished && currentBlog && !currentBlog.isPublished) {
      updateData.publishedAt = new Date();
    }

    const blog = await this.blogModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('author', 'name email')
      .exec();

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    return blog;
  }

  async remove(id: string): Promise<void> {
    const result = await this.blogModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Blog post not found');
    }
  }

  async getAllTags(
    locale: SupportedLocale = 'ar',
  ): Promise<{ value: string; label: string; count: number }[]> {
    const preferredField = locale === 'en' ? '$tagsEn' : '$tags';
    const fallbackField = locale === 'en' ? '$tags' : '$tagsEn';
    return this.blogModel.aggregate([
      { $match: { isPublished: true } },
      {
        $set: {
          localizedTags: {
            $cond: [
              { $gt: [{ $size: { $ifNull: [preferredField, []] } }, 0] },
              preferredField,
              { $ifNull: [fallbackField, []] },
            ],
          },
        },
      },
      { $unwind: '$localizedTags' },
      { $group: { _id: '$localizedTags', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      {
        $project: {
          _id: 0,
          value: '$_id',
          label: '$_id',
          count: 1,
        },
      },
    ]);
  }

  async getAllCategories(
    locale: SupportedLocale = 'ar',
  ): Promise<{ value: string; label: string; count: number }[]> {
    const labelField = locale === 'en' ? '$categoryEn' : '$category';
    return this.blogModel.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: { $ifNull: ['$categoryKey', '$category'] },
          label: { $first: { $ifNull: [labelField, '$category'] } },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, _id: 1 } },
      {
        $project: {
          _id: 0,
          value: '$_id',
          label: { $ifNull: ['$label', '$_id'] },
          count: 1,
        },
      },
    ]);
  }

  async getFeatured(limit = 3): Promise<BlogDocument[]> {
    return this.blogModel
      .find({ isPublished: true, isFeatured: true })
      .populate('author', 'name email')
      .sort({ featuredOrder: 1, publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async getPopular(limit = 5): Promise<BlogDocument[]> {
    return this.blogModel
      .find({ isPublished: true })
      .populate('author', 'name email')
      .sort({ views: -1, publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async getRelated(slug: string, limit = 3): Promise<BlogDocument[]> {
    const blog = await this.blogModel
      .findOne({ slug: slug.toLowerCase(), isPublished: true })
      .exec();

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    return this.blogModel
      .find({
        _id: { $ne: blog._id },
        isPublished: true,
        $or: [{ category: blog.category }, { tags: { $in: blog.tags || [] } }],
      })
      .populate('author', 'name email')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .exec();
  }
}
