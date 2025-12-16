import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HostingPackagesService } from './hosting-packages.service';
import { HostingPackagesController } from './hosting-packages.controller';
import {
  HostingPackage,
  HostingPackageSchema,
} from './schemas/hosting-package.schema';
import { LeadsModule } from '../leads/leads.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HostingPackage.name, schema: HostingPackageSchema },
    ]),
    forwardRef(() => LeadsModule),
  ],
  controllers: [HostingPackagesController],
  providers: [HostingPackagesService],
  exports: [HostingPackagesService],
})
export class HostingPackagesModule {}

