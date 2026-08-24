import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { About, AboutDocument } from './schemas/about.schema';
import { UpdateAboutDto } from './dto/update-about.dto';
import { getMissingEnglishFields } from '../common/localization/translation-completeness';

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
    const current = await this.aboutModel.findOne().lean().exec();
    const resultingAbout = { ...(current ?? {}), ...updateDto };
    const missingFields = getMissingEnglishFields('about', resultingAbout);
    if (resultingAbout.isActive !== false && missingFields.length > 0) {
      throw new BadRequestException({
        code: 'BILINGUAL_CONTENT_INCOMPLETE',
        message: 'English about content must be complete before activation',
        missingFields,
      });
    }
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
