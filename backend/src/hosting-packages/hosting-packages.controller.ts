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
import { HostingPackagesService } from './hosting-packages.service';
import { CreateHostingPackageDto } from './dto/create-hosting-package.dto';
import { UpdateHostingPackageDto } from './dto/update-hosting-package.dto';
import { FilterHostingPackageDto } from './dto/filter-hosting-package.dto';
import { CreatePackageSelectionDto } from './dto/create-package-selection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators';

@ApiTags('Hosting Packages')
@Controller('hosting-packages')
export class HostingPackagesController {
  constructor(
    private readonly hostingPackagesService: HostingPackagesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new hosting package' })
  @ApiResponse({ status: 201, description: 'Package created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Hosting package created successfully')
  create(@Body() createDto: CreateHostingPackageDto) {
    return this.hostingPackagesService.create(createDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all active hosting packages' })
  @ApiResponse({ status: 200, description: 'Packages fetched successfully' })
  @ResponseMessage('Hosting packages fetched successfully')
  findAll(@Query() filterDto: FilterHostingPackageDto) {
    return this.hostingPackagesService.findAll(filterDto, false);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all hosting packages including inactive (Admin)' })
  @ApiResponse({ status: 200, description: 'Packages fetched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Hosting packages fetched successfully')
  findAllAdmin(@Query() filterDto: FilterHostingPackageDto) {
    return this.hostingPackagesService.findAll(filterDto, true);
  }

  @Get('category/:category')
  @Public()
  @ApiOperation({ summary: 'Get packages by category' })
  @ApiResponse({ status: 200, description: 'Packages fetched successfully' })
  @ResponseMessage('Hosting packages fetched successfully')
  findByCategory(@Param('category') category: string) {
    return this.hostingPackagesService.findByCategory(category);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a hosting package by ID' })
  @ApiResponse({ status: 200, description: 'Package found' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @ResponseMessage('Hosting package fetched successfully')
  findOne(@Param('id') id: string) {
    return this.hostingPackagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a hosting package' })
  @ApiResponse({ status: 200, description: 'Package updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @ResponseMessage('Hosting package updated successfully')
  update(@Param('id') id: string, @Body() updateDto: UpdateHostingPackageDto) {
    return this.hostingPackagesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a hosting package' })
  @ApiResponse({ status: 200, description: 'Package deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @ResponseMessage('Hosting package deleted successfully')
  remove(@Param('id') id: string) {
    return this.hostingPackagesService.remove(id);
  }

  @Patch('sort/order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update sort order of packages' })
  @ApiResponse({ status: 200, description: 'Sort order updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Sort order updated successfully')
  updateSortOrder(@Body() packages: { id: string; sortOrder: number }[]) {
    return this.hostingPackagesService.updateSortOrder(packages);
  }

  @Post(':id/select')
  @Public()
  @ApiOperation({ summary: 'Select a hosting package and submit contact information' })
  @ApiResponse({ status: 201, description: 'Package selection submitted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @ResponseMessage('Thank you for your interest! We will contact you soon.')
  selectPackage(
    @Param('id') packageId: string,
    @Body() createPackageSelectionDto: CreatePackageSelectionDto,
  ) {
    return this.hostingPackagesService.handlePackageSelection(packageId, createPackageSelectionDto);
  }
}

