import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeadDocument = Lead & Document;

export enum ServiceType {
  WEB_APP = 'Web App',
  MOBILE_APP = 'Mobile App',
  AUTOMATION = 'Automation',
  ERP = 'ERP',
  ECOMMERCE = 'E-Commerce',
  CONSULTATION = 'Consultation',
  OTHER = 'Other',
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  PROPOSAL_SENT = 'Proposal Sent',
  NEGOTIATION = 'Negotiation',
  CLOSED_WON = 'Closed-Won',
  CLOSED_LOST = 'Closed-Lost',
}

export enum BudgetRange {
  SMALL = '< $1,000',
  MEDIUM = '$1,000 - $5,000',
  LARGE = '$5,000 - $15,000',
  ENTERPRISE = '$15,000+',
  NOT_SPECIFIED = 'Not Specified',
}

@Schema({ timestamps: true })
export class Lead {
  @Prop({ required: true })
  fullName: string;

  @Prop()
  companyName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({
    type: String,
    enum: BudgetRange,
    default: BudgetRange.NOT_SPECIFIED,
  })
  budgetRange: BudgetRange;

  @Prop({
    type: String,
    enum: ServiceType,
    required: true,
  })
  serviceType: ServiceType;

  @Prop()
  message: string;

  @Prop({
    type: String,
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Prop()
  notes: string;

  @Prop()
  source: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

// Indexes
LeadSchema.index({ status: 1 });
LeadSchema.index({ serviceType: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ email: 1 });

