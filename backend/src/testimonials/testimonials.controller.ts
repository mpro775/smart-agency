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
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators';

@ApiTags('Testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new testimonial' })
  @ApiResponse({ status: 201, description: 'Testimonial created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Testimonial created successfully')
  create(@Body() createDto: CreateTestimonialDto) {
    return this.testimonialsService.create(createDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all active testimonials' })
  @ApiResponse({ status: 200, description: 'Testimonials fetched successfully' })
  @ResponseMessage('Testimonials fetched successfully')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.testimonialsService.findAll(paginationDto, false);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all testimonials including inactive (Admin)' })
  @ApiResponse({ status: 200, description: 'Testimonials fetched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Testimonials fetched successfully')
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.testimonialsService.findAll(paginationDto, true);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured testimonials for homepage' })
  @ApiResponse({ status: 200, description: 'Featured testimonials fetched' })
  @ResponseMessage('Featured testimonials fetched successfully')
  findFeatured() {
    return this.testimonialsService.findFeatured();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get testimonial statistics' })
  @ApiResponse({ status: 200, description: 'Stats fetched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Testimonial statistics fetched successfully')
  getStats() {
    return this.testimonialsService.getStats();
  }

  @Get('project/:projectId')
  @Public()
  @ApiOperation({ summary: 'Get testimonials for a specific project' })
  @ApiResponse({ status: 200, description: 'Testimonials fetched successfully' })
  @ResponseMessage('Project testimonials fetched successfully')
  findByProject(@Param('projectId') projectId: string) {
    return this.testimonialsService.findByProject(projectId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a testimonial by ID' })
  @ApiResponse({ status: 200, description: 'Testimonial found' })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  @ResponseMessage('Testimonial fetched successfully')
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a testimonial' })
  @ApiResponse({ status: 200, description: 'Testimonial updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  @ResponseMessage('Testimonial updated successfully')
  update(@Param('id') id: string, @Body() updateDto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a testimonial' })
  @ApiResponse({ status: 200, description: 'Testimonial deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  @ResponseMessage('Testimonial deleted successfully')
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}

