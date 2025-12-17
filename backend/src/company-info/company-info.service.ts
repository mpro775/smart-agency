import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CompanyInfo,
  CompanyInfoDocument,
} from './schemas/company-info.schema';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';

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
