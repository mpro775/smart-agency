import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UserRole } from '../auth/dto/register.dto';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const shouldSeedAdmin = this.configService.get<string>('SEED_ADMIN');
    if (shouldSeedAdmin !== 'true') {
      this.logger.log(
        'Admin seeding skipped. Set SEED_ADMIN=true to create an admin user.',
      );
      return;
    }

    const adminEmail = this.configService.get<string>('SEED_ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('SEED_ADMIN_PASSWORD');
    const adminName =
      this.configService.get<string>('SEED_ADMIN_NAME') || 'Admin';

    if (!adminEmail || !adminPassword) {
      throw new Error(
        'SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required when SEED_ADMIN=true',
      );
    }

    if (
      this.configService.get<string>('NODE_ENV') === 'production' &&
      !this.isStrongPassword(adminPassword)
    ) {
      throw new Error(
        'SEED_ADMIN_PASSWORD must be at least 12 characters and include uppercase, lowercase, number, and symbol in production',
      );
    }

    const existingAdmin = await this.userModel
      .findOne({ email: adminEmail })
      .exec();

    if (existingAdmin) {
      this.logger.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = new this.userModel({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await admin.save();

    this.logger.log('===========================================');
    this.logger.log('Admin user created successfully!');
    this.logger.log(`Email: ${adminEmail}`);
    this.logger.log('⚠️  Please change the password after first login!');
    this.logger.log('===========================================');
  }

  private isStrongPassword(password: string): boolean {
    return (
      password.length >= 12 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  }
}
