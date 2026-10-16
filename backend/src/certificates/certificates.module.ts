import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TraineesModule } from '../trainees/trainees.module';
import { Certificate, CertificateSchema } from './schemas/certificate.schema';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { VerificationUrlService } from './verification-url.service';
@Module({
  imports: [
    TraineesModule,
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema },
    ]),
  ],
  providers: [CertificatesService, VerificationUrlService],
  controllers: [CertificatesController],
})
export class CertificatesModule {}
