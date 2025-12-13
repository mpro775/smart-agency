import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UserRole } from '../auth/dto/register.dto';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminEmail = 'admin@smartagency.com';

    const existingAdmin = await this.userModel
      .findOne({ email: adminEmail })
      .exec();

    if (existingAdmin) {
      this.logger.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new this.userModel({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await admin.save();

    this.logger.log('===========================================');
    this.logger.log('Admin user created successfully!');
    this.logger.log('Email: admin@smartagency.com');
    this.logger.log('Password: admin123');
    this.logger.log('⚠️  Please change the password after first login!');
    this.logger.log('===========================================');
  }
}
