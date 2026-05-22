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

export enum LeadType {
  CONTACT = 'Contact',
  PROJECT_BRIEF = 'Project Brief',
  PACKAGE_REQUEST = 'Package Request',
}

export enum ProjectStage {
  IDEA = 'Idea',
  EXISTING_BUSINESS = 'Existing Business',
  REDESIGN = 'Redesign',
  SCALING = 'Scaling',
}

export enum Timeline {
  URGENT = 'Urgent',
  ONE_MONTH = '1 Month',
  TWO_THREE_MONTHS = '2-3 Months',
  FLEXIBLE = 'Flexible',
}

export enum PreferredContactMethod {
  WHATSAPP = 'WhatsApp',
  PHONE = 'Phone',
  EMAIL = 'Email',
  MEETING = 'Meeting',
}

export enum CompanySize {
  INDIVIDUAL = 'Individual',
  STARTUP = 'Startup',
  SMALL_BUSINESS = 'Small Business',
  COMPANY = 'Company',
}

export enum LeadPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
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

  @Prop({ type: String, enum: LeadType, default: LeadType.PROJECT_BRIEF })
  leadType: LeadType;

  @Prop({ type: String, enum: ProjectStage })
  projectStage?: ProjectStage;

  @Prop()
  projectGoal?: string;

  @Prop({ type: String, enum: Timeline })
  timeline?: Timeline;

  @Prop({ type: String, enum: PreferredContactMethod })
  preferredContactMethod?: PreferredContactMethod;

  @Prop({ type: String, enum: CompanySize })
  companySize?: CompanySize;

  @Prop()
  currentWebsite?: string;

  @Prop({ type: [String], default: [] })
  referenceLinks?: string[];

  @Prop()
  hasBrandIdentity?: boolean;

  @Prop()
  hasContentReady?: boolean;

  @Prop()
  expectedLaunchDate?: Date;

  @Prop()
  meetingPreference?: string;

  @Prop()
  contactReason?: string;

  @Prop({ type: Object })
  projectAnswers?: Record<string, unknown>;

  @Prop({ type: String, enum: LeadPriority, default: LeadPriority.MEDIUM })
  priority: LeadPriority;

  createdAt?: Date;
  updatedAt?: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

// Indexes
LeadSchema.index({ status: 1 });
LeadSchema.index({ status: 1, createdAt: -1 });
LeadSchema.index({ serviceType: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ email: 1 });
LeadSchema.index({ email: 1, createdAt: -1 });
LeadSchema.index({ leadType: 1 });
LeadSchema.index({ priority: 1 });
LeadSchema.index({ timeline: 1 });
LeadSchema.index({ preferredContactMethod: 1 });
LeadSchema.index({ leadType: 1, status: 1, createdAt: -1 });
