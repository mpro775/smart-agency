import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators';
import { PublicHomepageService } from './public-homepage.service';

@ApiTags('Public')
@Controller('public')
export class PublicHomepageController {
  constructor(
    private readonly publicHomepageService: PublicHomepageService,
  ) {}

  @Get('homepage')
  @Public()
  @ApiOperation({ summary: 'Get public homepage content in one response' })
  @ApiResponse({ status: 200, description: 'Homepage content fetched successfully' })
  @ResponseMessage('Homepage content fetched successfully')
  getHomepage() {
    return this.publicHomepageService.getHomepage();
  }
}
