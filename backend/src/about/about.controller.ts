import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ResponseMessage } from '../common/decorators';

@ApiTags('About')
@Controller('about')
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get about us information' })
  @ApiResponse({
    status: 200,
    description: 'About us information fetched successfully',
  })
  @ResponseMessage('About us information fetched successfully')
  findOne() {
    return this.aboutService.findOne();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update about us information (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'About us information updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('About us information updated successfully')
  update(@Body() updateDto: UpdateAboutDto) {
    return this.aboutService.update(updateDto);
  }
}
