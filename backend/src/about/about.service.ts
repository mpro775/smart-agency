import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { About, AboutDocument } from './schemas/about.schema';
import { UpdateAboutDto } from './dto/update-about.dto';

@Injectable()
export class AboutService {
  constructor(
    @InjectModel(About.name)
    private aboutModel: Model<AboutDocument>,
  ) {}

  async findOne(): Promise<AboutDocument | null> {
    return this.aboutModel.findOne({ isActive: true }).exec();
  }

  async update(updateDto: UpdateAboutDto): Promise<AboutDocument> {
    // Use findOneAndUpdate with upsert to ensure only one document exists
    const about = await this.aboutModel
      .findOneAndUpdate({}, updateDto, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      })
      .exec();

    return about;
  }
}
