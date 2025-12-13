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
import { TeamService } from './team.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { FilterTeamDto } from './dto/filter-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add a new team member' })
  @ApiResponse({ status: 201, description: 'Team member added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Team member added successfully')
  create(@Body() createDto: CreateTeamMemberDto) {
    return this.teamService.create(createDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all active team members' })
  @ApiResponse({ status: 200, description: 'Team members fetched successfully' })
  @ResponseMessage('Team members fetched successfully')
  findAll(@Query() filterDto: FilterTeamDto) {
    return this.teamService.findAll(filterDto, false);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all team members including inactive (Admin)' })
  @ApiResponse({ status: 200, description: 'Team members fetched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Team members fetched successfully')
  findAllAdmin(@Query() filterDto: FilterTeamDto) {
    return this.teamService.findAll(filterDto, true);
  }

  @Get('homepage')
  @Public()
  @ApiOperation({ summary: 'Get team members for homepage display' })
  @ApiResponse({ status: 200, description: 'Team members fetched successfully' })
  @ResponseMessage('Team members fetched successfully')
  findForHomepage() {
    return this.teamService.findForHomepage();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get team statistics' })
  @ApiResponse({ status: 200, description: 'Stats fetched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Team statistics fetched successfully')
  getStats() {
    return this.teamService.getStats();
  }

  @Get('department/:department')
  @Public()
  @ApiOperation({ summary: 'Get team members by department' })
  @ApiResponse({ status: 200, description: 'Team members fetched successfully' })
  @ResponseMessage('Team members fetched successfully')
  findByDepartment(@Param('department') department: string) {
    return this.teamService.findByDepartment(department);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a team member by ID' })
  @ApiResponse({ status: 200, description: 'Team member found' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ResponseMessage('Team member fetched successfully')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @Patch('sort/order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update sort order of team members' })
  @ApiResponse({ status: 200, description: 'Sort order updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Sort order updated successfully')
  updateSortOrder(@Body() members: { id: string; sortOrder: number }[]) {
    return this.teamService.updateSortOrder(members);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a team member' })
  @ApiResponse({ status: 200, description: 'Team member updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ResponseMessage('Team member updated successfully')
  update(@Param('id') id: string, @Body() updateDto: UpdateTeamMemberDto) {
    return this.teamService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove a team member' })
  @ApiResponse({ status: 200, description: 'Team member removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ResponseMessage('Team member removed successfully')
  remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }
}

