import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CompanyInfo,
  CompanyInfoDocument,
} from './schemas/company-info.schema';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';
import { getMissingEnglishFields } from '../common/localization/translation-completeness';

@Injectable()
export class CompanyInfoService {
  constructor(
    @InjectModel(CompanyInfo.name)
    private companyInfoModel: Model<CompanyInfoDocument>,
  ) {}

  async findOne(): Promise<CompanyInfoDocument | null> {
    return this.companyInfoModel.findOne().exec();
  }

  async update(updateDto: UpdateCompanyInfoDto): Promise<CompanyInfoDocument> {
    const current = await this.companyInfoModel.findOne().lean().exec();
    const resultingInfo = { ...(current ?? {}), ...updateDto };
    const missingFields = getMissingEnglishFields('companyInfo', resultingInfo);
    if (missingFields.length > 0) {
      throw new BadRequestException({
        code: 'BILINGUAL_CONTENT_INCOMPLETE',
        message: 'English company information must be complete before display',
        missingFields,
      });
    }
    // Use findOneAndUpdate with upsert to ensure only one document exists
    const companyInfo = await this.companyInfoModel
      .findOneAndUpdate({}, updateDto, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      })
      .exec();

    return companyInfo;
  }
}
