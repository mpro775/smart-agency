import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { FilterCertificatesDto } from './dto/filter-certificates.dto';
import { RevokeCertificateDto } from './dto/revoke-certificate.dto';

@ApiTags('Certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly service: CertificatesService) {}
  @Get('verify/:certificateId')
  @Public()
  @SetMetadata('preservePublicTranslations', true)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  verify(@Param('certificateId') id: string) {
    return this.service.verify(id);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('JWT-auth')
  list(@Query() dto: FilterCertificatesDto) {
    return this.service.findAll(dto);
  }
  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('JWT-auth')
  get(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('JWT-auth')
  create(
    @Body() dto: CreateCertificateDto,
    @CurrentUser('userId') actor: string,
  ) {
    return this.service.create(dto, actor);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('JWT-auth')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCertificateDto,
    @CurrentUser('userId') actor: string,
  ) {
    return this.service.update(id, dto, actor);
  }
  @Post(':id/issue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  issue(@Param('id') id: string, @CurrentUser('userId') actor: string) {
    return this.service.issue(id, actor);
  }
  @Post(':id/revoke')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  revoke(
    @Param('id') id: string,
    @Body() dto: RevokeCertificateDto,
    @CurrentUser('userId') actor: string,
  ) {
    return this.service.revoke(id, dto.reason, actor);
  }
}
