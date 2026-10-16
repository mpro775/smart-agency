import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { TraineesService } from './trainees.service';
import { CreateTraineeDto } from './dto/create-trainee.dto';
import { UpdateTraineeDto } from './dto/update-trainee.dto';
import { FilterTraineesDto } from './dto/filter-trainees.dto';

@ApiTags('Trainees')
@ApiBearerAuth('JWT-auth')
@Controller('trainees')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class TraineesController {
  constructor(private readonly service: TraineesService) {}
  @Get('admin') list(@Query() dto: FilterTraineesDto) {
    return this.service.findAll(dto);
  }
  @Get('admin/:id') get(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Post() create(@Body() dto: CreateTraineeDto) {
    return this.service.create(dto);
  }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateTraineeDto) {
    return this.service.update(id, dto);
  }
}
