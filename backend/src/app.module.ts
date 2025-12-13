import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { LeadsModule } from './leads/leads.module';
import { BlogModule } from './blog/blog.module';
import { UploadsModule } from './uploads/uploads.module';
import { DatabaseModule } from './database/database.module';
import { HostingPackagesModule } from './hosting-packages/hosting-packages.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { TeamModule } from './team/team.module';
import { FaqsModule } from './faqs/faqs.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),

    // Common Module (Interceptors, Filters)
    CommonModule,

    // Database Seeder
    DatabaseModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    ProjectsModule,
    TechnologiesModule,
    LeadsModule,
    BlogModule,
    UploadsModule,
    HostingPackagesModule,
    TestimonialsModule,
    TeamModule,
    FaqsModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

