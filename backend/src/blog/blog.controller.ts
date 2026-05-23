import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FilterBlogDto } from './dto/filter-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ResponseMessage } from '../common/decorators';

@ApiTags('Blog')
@Controller('blog')
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: 201, description: 'Blog post created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Blog slug already exists' })
  @ResponseMessage('Blog post created successfully')
  create(
    @Body() createBlogDto: CreateBlogDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.blogService.create(createBlogDto, userId);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all published blog posts' })
  @ApiResponse({ status: 200, description: 'Blog posts fetched successfully' })
  @ResponseMessage('Blog posts fetched successfully')
  findAll(@Query() filterDto: FilterBlogDto) {
    return this.blogService.findAll(filterDto, false);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all blog posts including drafts (Admin)' })
  @ApiResponse({ status: 200, description: 'Blog posts fetched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Blog posts fetched successfully')
  findAllAdmin(@Query() filterDto: FilterBlogDto) {
    return this.blogService.findAll(filterDto, true);
  }

  @Get('tags')
  @Public()
  @ApiOperation({ summary: 'Get all unique tags' })
  @ApiResponse({ status: 200, description: 'Tags fetched successfully' })
  @ResponseMessage('Tags fetched successfully')
  getAllTags() {
    return this.blogService.getAllTags();
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get all blog categories' })
  @ApiResponse({ status: 200, description: 'Categories fetched successfully' })
  @ResponseMessage('Categories fetched successfully')
  getCategories() {
    return this.blogService.getAllCategories();
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured blog posts' })
  @ApiResponse({
    status: 200,
    description: 'Featured posts fetched successfully',
  })
  @ResponseMessage('Featured posts fetched successfully')
  getFeatured(@Query('limit') limit?: string) {
    return this.blogService.getFeatured(limit ? Number(limit) : 3);
  }

  @Get('popular')
  @Public()
  @ApiOperation({ summary: 'Get popular blog posts' })
  @ApiResponse({
    status: 200,
    description: 'Popular posts fetched successfully',
  })
  @ResponseMessage('Popular posts fetched successfully')
  getPopular(@Query('limit') limit?: string) {
    return this.blogService.getPopular(limit ? Number(limit) : 5);
  }

  @Get('related/:slug')
  @Public()
  @ApiOperation({ summary: 'Get related blog posts' })
  @ApiResponse({
    status: 200,
    description: 'Related posts fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  @ResponseMessage('Related posts fetched successfully')
  getRelated(@Param('slug') slug: string, @Query('limit') limit?: string) {
    return this.blogService.getRelated(slug, limit ? Number(limit) : 3);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get a blog post by slug' })
  @ApiResponse({ status: 200, description: 'Blog post found' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  @ResponseMessage('Blog post fetched successfully')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a blog post by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Blog post found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  @ResponseMessage('Blog post fetched successfully')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  @ApiResponse({ status: 409, description: 'Blog slug already exists' })
  @ResponseMessage('Blog post updated successfully')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  @ResponseMessage('Blog post deleted successfully')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
