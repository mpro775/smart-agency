import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CompanyInfoService } from './company-info.service';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ResponseMessage } from '../common/decorators';

@ApiTags('Company Info')
@Controller('company-info')
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class CompanyInfoController {
  constructor(private readonly companyInfoService: CompanyInfoService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get company information' })
  @ApiResponse({
    status: 200,
    description: 'Company information fetched successfully',
  })
  @ResponseMessage('Company information fetched successfully')
  findOne() {
    return this.companyInfoService.findOne();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update company information (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Company information updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ResponseMessage('Company information updated successfully')
  update(@Body() updateDto: UpdateCompanyInfoDto) {
    return this.companyInfoService.update(updateDto);
  }
}
