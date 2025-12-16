import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProjectCategoriesService } from './project-categories.service';
import { CreateProjectCategoryDto } from './dto/create-project-category.dto';
import { UpdateProjectCategoryDto } from './dto/update-project-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators';

@ApiTags('Project Categories')
@Controller('project-categories')
export class ProjectCategoriesController {
  constructor(
    private readonly categoriesService: ProjectCategoriesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new project category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Category value already exists' })
  @ResponseMessage('Category created successfully')
  create(@Body() createCategoryDto: CreateProjectCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all project categories' })
  @ApiResponse({ status: 200, description: 'Categories fetched successfully' })
  @ResponseMessage('Categories fetched successfully')
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('active')
  @Public()
  @ApiOperation({ summary: 'Get all active project categories' })
  @ApiResponse({
    status: 200,
    description: 'Active categories fetched successfully',
  })
  @ResponseMessage('Active categories fetched successfully')
  findActive() {
    return this.categoriesService.findActive();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ResponseMessage('Category fetched successfully')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a project category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category value already exists' })
  @ResponseMessage('Category updated successfully')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateProjectCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a project category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ResponseMessage('Category deleted successfully')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
