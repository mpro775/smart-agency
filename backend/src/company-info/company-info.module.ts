import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyInfoService } from './company-info.service';
import { CompanyInfoController } from './company-info.controller';
import { CompanyInfo, CompanyInfoSchema } from './schemas/company-info.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompanyInfo.name, schema: CompanyInfoSchema },
    ]),
  ],
  controllers: [CompanyInfoController],
  providers: [CompanyInfoService],
  exports: [CompanyInfoService],
})
export class CompanyInfoModule {}
