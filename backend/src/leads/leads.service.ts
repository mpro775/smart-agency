import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import axios from 'axios';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { FilterLeadsDto } from './dto/filter-leads.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    private configService: ConfigService,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<LeadDocument> {
    const lead = new this.leadModel(createLeadDto);
    const savedLead = await lead.save();

    // Send to n8n webhook (fire and forget)
    this.sendToWebhook(savedLead);

    return savedLead;
  }

  private async sendToWebhook(lead: LeadDocument): Promise<void> {
    const webhookUrl = this.configService.get<string>('N8N_WEBHOOK_URL');

    if (!webhookUrl) {
      this.logger.warn('N8N_WEBHOOK_URL not configured, skipping webhook');
      return;
    }

    try {
      await axios.post(webhookUrl, {
        id: lead._id.toString(),
        fullName: lead.fullName,
        companyName: lead.companyName,
        email: lead.email,
        phone: lead.phone,
        budgetRange: lead.budgetRange,
        serviceType: lead.serviceType,
        message: lead.message,
        source: lead.source,
        createdAt: lead.createdAt,
      });

      this.logger.log(`Lead ${lead._id} sent to webhook successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to send lead ${lead._id} to webhook: ${error.message}`,
      );
      // Don't throw - webhook failure shouldn't affect lead creation
    }
  }

  async findAll(
    filterDto: FilterLeadsDto,
  ): Promise<PaginatedResponseDto<LeadDocument>> {
    const { page = 1, limit = 10, status, serviceType, search } = filterDto;

    // Build query
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (serviceType) {
      query.serviceType = serviceType;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await this.leadModel.countDocuments(query).exec();

    // Get paginated results
    const leads = await this.leadModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return new PaginatedResponseDto(leads, total, page, limit);
  }

  async findOne(id: string): Promise<LeadDocument> {
    const lead = await this.leadModel.findById(id).exec();

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<LeadDocument> {
    const lead = await this.leadModel
      .findByIdAndUpdate(id, updateLeadDto, { new: true })
      .exec();

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async remove(id: string): Promise<void> {
    const result = await this.leadModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Lead not found');
    }
  }

  async getStats(): Promise<any> {
    const [
      total,
      newLeads,
      contacted,
      proposalSent,
      won,
      lost,
    ] = await Promise.all([
      this.leadModel.countDocuments().exec(),
      this.leadModel.countDocuments({ status: 'New' }).exec(),
      this.leadModel.countDocuments({ status: 'Contacted' }).exec(),
      this.leadModel.countDocuments({ status: 'Proposal Sent' }).exec(),
      this.leadModel.countDocuments({ status: 'Closed-Won' }).exec(),
      this.leadModel.countDocuments({ status: 'Closed-Lost' }).exec(),
    ]);

    return {
      total,
      byStatus: {
        new: newLeads,
        contacted,
        proposalSent,
        won,
        lost,
      },
      conversionRate: total > 0 ? ((won / total) * 100).toFixed(2) + '%' : '0%',
    };
  }
}

