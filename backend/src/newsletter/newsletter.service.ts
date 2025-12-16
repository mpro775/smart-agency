import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Newsletter, NewsletterDocument } from './schemas/newsletter.schema';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    @InjectModel(Newsletter.name)
    private newsletterModel: Model<NewsletterDocument>,
  ) {}

  async subscribe(subscribeDto: SubscribeNewsletterDto): Promise<{ message: string; success: boolean }> {
    try {
      const { email, source = 'footer' } = subscribeDto;

      // التحقق من وجود البريد الإلكتروني بالفعل
      const existingSubscription = await this.newsletterModel.findOne({
        email: email.toLowerCase().trim(),
        isActive: true
      });

      if (existingSubscription) {
        throw new ConflictException('This email is already subscribed to our newsletter');
      }

      // إنشاء اشتراك جديد
      const newSubscription = new this.newsletterModel({
        email: email.toLowerCase().trim(),
        source,
        subscribedAt: new Date(),
        isActive: true,
      });

      await newSubscription.save();

      this.logger.log(`New newsletter subscription: ${email} from ${source}`);

      return {
        message: 'Thank you for subscribing to our newsletter! You will receive the latest updates and offers.',
        success: true,
      };
    } catch (error) {
      this.logger.error(`Newsletter subscription error: ${error.message}`, error.stack);

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new Error('Failed to subscribe to newsletter. Please try again.');
    }
  }

  async unsubscribe(email: string): Promise<{ message: string; success: boolean }> {
    try {
      const result = await this.newsletterModel.findOneAndUpdate(
        { email: email.toLowerCase().trim(), isActive: true },
        {
          isActive: false,
          unsubscribedAt: new Date()
        },
        { new: true }
      );

      if (!result) {
        throw new Error('Email not found in our newsletter list');
      }

      this.logger.log(`Newsletter unsubscription: ${email}`);

      return {
        message: 'You have been successfully unsubscribed from our newsletter.',
        success: true,
      };
    } catch (error) {
      this.logger.error(`Newsletter unsubscription error: ${error.message}`, error.stack);
      throw new Error('Failed to unsubscribe from newsletter. Please try again.');
    }
  }

  async getSubscribersCount(): Promise<number> {
    return this.newsletterModel.countDocuments({ isActive: true });
  }

  async getSubscribersBySource(): Promise<any[]> {
    return this.newsletterModel.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          source: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
  }
}
