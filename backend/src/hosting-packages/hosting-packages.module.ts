import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HostingPackagesService } from './hosting-packages.service';
import { HostingPackagesController } from './hosting-packages.controller';
import {
  HostingPackage,
  HostingPackageSchema,
} from './schemas/hosting-package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HostingPackage.name, schema: HostingPackageSchema },
    ]),
  ],
  controllers: [HostingPackagesController],
  providers: [HostingPackagesService],
  exports: [HostingPackagesService],
})
export class HostingPackagesModule {}

