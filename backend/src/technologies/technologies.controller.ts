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
  ApiQuery,
} from '@nestjs/swagger';
import { TechnologiesService } from './technologies.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { TechnologyCategory } from './schemas/technology.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators';

@ApiTags('Technologies')
@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new technology' })
  @ApiResponse({ status: 201, description: 'Technology created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Technology created successfully')
  create(@Body() createTechnologyDto: CreateTechnologyDto) {
    return this.technologiesService.create(createTechnologyDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all technologies' })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: TechnologyCategory,
    description: 'Filter by category',
  })
  @ApiResponse({ status: 200, description: 'Technologies fetched successfully' })
  @ResponseMessage('Technologies fetched successfully')
  findAll(@Query('category') category?: TechnologyCategory) {
    return this.technologiesService.findAll(category);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a technology by ID' })
  @ApiResponse({ status: 200, description: 'Technology found' })
  @ApiResponse({ status: 404, description: 'Technology not found' })
  @ResponseMessage('Technology fetched successfully')
  findOne(@Param('id') id: string) {
    return this.technologiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a technology' })
  @ApiResponse({ status: 200, description: 'Technology updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Technology not found' })
  @ResponseMessage('Technology updated successfully')
  update(
    @Param('id') id: string,
    @Body() updateTechnologyDto: UpdateTechnologyDto,
  ) {
    return this.technologiesService.update(id, updateTechnologyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a technology' })
  @ApiResponse({ status: 200, description: 'Technology deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Technology not found' })
  @ResponseMessage('Technology deleted successfully')
  remove(@Param('id') id: string) {
    return this.technologiesService.remove(id);
  }
}

