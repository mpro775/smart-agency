import { PartialType } from '@nestjs/swagger';
import { CreateHostingPackageDto } from './create-hosting-package.dto';

export class UpdateHostingPackageDto extends PartialType(CreateHostingPackageDto) {}

