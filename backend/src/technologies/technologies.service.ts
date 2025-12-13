import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Technology,
  TechnologyDocument,
  TechnologyCategory,
} from './schemas/technology.schema';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectModel(Technology.name)
    private technologyModel: Model<TechnologyDocument>,
  ) {}

  async create(
    createTechnologyDto: CreateTechnologyDto,
  ): Promise<TechnologyDocument> {
    const technology = new this.technologyModel(createTechnologyDto);
    return technology.save();
  }

  async findAll(category?: TechnologyCategory): Promise<TechnologyDocument[]> {
    const query = category ? { category } : {};
    return this.technologyModel.find(query).sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<TechnologyDocument> {
    const technology = await this.technologyModel.findById(id).exec();
    if (!technology) {
      throw new NotFoundException('Technology not found');
    }
    return technology;
  }

  async findByIds(ids: string[]): Promise<TechnologyDocument[]> {
    return this.technologyModel.find({ _id: { $in: ids } }).exec();
  }

  async update(
    id: string,
    updateTechnologyDto: UpdateTechnologyDto,
  ): Promise<TechnologyDocument> {
    const technology = await this.technologyModel
      .findByIdAndUpdate(id, updateTechnologyDto, { new: true })
      .exec();

    if (!technology) {
      throw new NotFoundException('Technology not found');
    }

    return technology;
  }

  async remove(id: string): Promise<void> {
    const result = await this.technologyModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Technology not found');
    }
  }
}

