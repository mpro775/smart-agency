import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Query, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto, NewsletterResponseDto } from './dto/subscribe-newsletter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({
    status: 201,
    description: 'Successfully subscribed to newsletter',
    type: NewsletterResponseDto
  })
  @ApiResponse({ status: 409, description: 'Email already subscribed' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ResponseMessage('Thank you for subscribing to our newsletter!')
  async subscribe(@Body() subscribeDto: SubscribeNewsletterDto): Promise<NewsletterResponseDto> {
    return this.newsletterService.subscribe(subscribeDto);
  }

  @Post('unsubscribe')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unsubscribe from newsletter' })
  @ApiResponse({
    status: 200,
    description: 'Successfully unsubscribed from newsletter',
    type: NewsletterResponseDto
  })
  @ApiResponse({ status: 404, description: 'Email not found' })
  @ResponseMessage('You have been unsubscribed from our newsletter.')
  async unsubscribe(@Body('email') email: string): Promise<NewsletterResponseDto> {
    return this.newsletterService.unsubscribe(email);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get newsletter statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Newsletter statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async getStats() {
    const [totalSubscribers, subscribersBySource] = await Promise.all([
      this.newsletterService.getSubscribersCount(),
      this.newsletterService.getSubscribersBySource(),
    ]);

    return {
      totalSubscribers,
      subscribersBySource,
    };
  }
}
