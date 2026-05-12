import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FilterBlogDto } from './dto/filter-blog.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';

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
      category: createBlogDto.category || 'general',
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
      query.tags = tag;
    }

    if (category) {
      query.category = category;
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
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
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
    const blogs = await this.blogModel
      .find(query)
      .populate('author', 'name email')
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return new PaginatedResponseDto(blogs, total, page, limit);
  }

  async findBySlug(slug: string): Promise<BlogDocument> {
    const blog = await this.blogModel
      .findOne({ slug: slug.toLowerCase(), isPublished: true })
      .populate('author', 'name email')
      .exec();

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

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<BlogDocument> {
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

    if (updateBlogDto.content && !updateBlogDto.readingTime) {
      updateData.readingTime = this.calculateReadingTime(updateBlogDto.content);
    }

    if (
      updateBlogDto.isPublished &&
      currentBlog &&
      !currentBlog.isPublished
    ) {
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

  async getAllTags(): Promise<
    { value: string; label: string; count: number }[]
  > {
    return this.blogModel.aggregate([
      { $match: { isPublished: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
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

  async getAllCategories(): Promise<
    { value: string; label: string; count: number }[]
  > {
    return this.blogModel.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
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
