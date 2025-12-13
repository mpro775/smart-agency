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
import { FaqsService } from './faqs.service';
import { CreateFaqDto, UpdateFaqDto, FilterFaqDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators';

@ApiTags('FAQs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  // ==================== Public Routes ====================

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all active FAQs (public)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of FAQs' })
  @ResponseMessage('FAQs retrieved successfully')
  findAll(@Query() filterDto: FilterFaqDto) {
    return this.faqsService.findAll(filterDto, false);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get all FAQ categories' })
  @ApiResponse({ status: 200, description: 'Returns list of categories' })
  @ResponseMessage('Categories retrieved successfully')
  getCategories() {
    return this.faqsService.getCategories();
  }

  @Get('category/:category')
  @Public()
  @ApiOperation({ summary: 'Get FAQs by category' })
  @ApiResponse({ status: 200, description: 'Returns FAQs in the category' })
  @ResponseMessage('FAQs retrieved successfully')
  findByCategory(@Param('category') category: string) {
    return this.faqsService.findByCategory(category);
  }

  // ==================== Admin Routes ====================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new FAQ (Admin)' })
  @ApiResponse({ status: 201, description: 'FAQ created successfully' })
  @ResponseMessage('FAQ created successfully')
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqsService.create(createFaqDto);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all FAQs including inactive (Admin)' })
  @ApiResponse({ status: 200, description: 'Returns all FAQs' })
  @ResponseMessage('FAQs retrieved successfully')
  findAllAdmin(@Query() filterDto: FilterFaqDto) {
    return this.faqsService.findAll(filterDto, true);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a FAQ by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Returns the FAQ' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  @ResponseMessage('FAQ retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.faqsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a FAQ (Admin)' })
  @ApiResponse({ status: 200, description: 'FAQ updated successfully' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  @ResponseMessage('FAQ updated successfully')
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqsService.update(id, updateFaqDto);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle FAQ active status (Admin)' })
  @ApiResponse({ status: 200, description: 'FAQ status toggled' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  @ResponseMessage('FAQ status toggled successfully')
  toggleActive(@Param('id') id: string) {
    return this.faqsService.toggleActive(id);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reorder FAQs (Admin)' })
  @ApiResponse({ status: 200, description: 'FAQs reordered successfully' })
  @ResponseMessage('FAQs reordered successfully')
  reorder(@Body() ids: string[]) {
    return this.faqsService.reorder(ids);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a FAQ (Admin)' })
  @ApiResponse({ status: 200, description: 'FAQ deleted successfully' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  @ResponseMessage('FAQ deleted successfully')
  remove(@Param('id') id: string) {
    return this.faqsService.remove(id);
  }
}
