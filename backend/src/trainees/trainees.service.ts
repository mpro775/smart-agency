import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Trainee } from './schemas/trainee.schema';
import { CreateTraineeDto } from './dto/create-trainee.dto';
import { UpdateTraineeDto } from './dto/update-trainee.dto';
import { FilterTraineesDto } from './dto/filter-trainees.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import {
  credentialError,
  credentialNotFound,
  literalSearch,
  objectId,
} from '../common/utils/credential.utils';

@Injectable()
export class TraineesService {
  constructor(
    @InjectModel(Trainee.name) private readonly model: Model<Trainee>,
  ) {}
  private validatePhoto(photo: CreateTraineeDto['photo']) {
    if (
      photo &&
      ![
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
      ].includes(photo.mimeType)
    )
      credentialError('INVALID_IMAGE', 'A supported image is required');
  }
  create(dto: CreateTraineeDto) {
    this.validatePhoto(dto.photo);
    return this.model.create(dto);
  }
  async findAll(dto: FilterTraineesDto) {
    const { page = 1, limit = 10, search, isActive } = dto;
    const query: FilterQuery<Trainee> = {};
    if (isActive !== undefined) query.isActive = isActive;
    if (search) {
      const regex = literalSearch(search);
      query.$or = [
        { fullName: regex },
        { fullNameEn: regex },
        { email: regex },
      ];
    }
    const [items, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query),
    ]);
    return new PaginatedResponseDto(items, total, page, limit);
  }
  async findOne(id: string) {
    const trainee = await this.model
      .findById(objectId(id, 'TRAINEE_NOT_FOUND'))
      .exec();
    if (!trainee) credentialNotFound('TRAINEE_NOT_FOUND', 'Trainee not found');
    return trainee;
  }
  async update(id: string, dto: UpdateTraineeDto) {
    this.validatePhoto(dto.photo);
    const trainee = await this.model
      .findByIdAndUpdate(
        objectId(id, 'TRAINEE_NOT_FOUND'),
        { $set: dto },
        { new: true, runValidators: true },
      )
      .exec();
    if (!trainee) credentialNotFound('TRAINEE_NOT_FOUND', 'Trainee not found');
    return trainee;
  }
}
