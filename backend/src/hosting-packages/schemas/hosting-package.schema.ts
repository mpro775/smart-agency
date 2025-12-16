import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HostingPackageDocument = HostingPackage & Document;

export enum BillingCycle {
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  SEMI_ANNUALLY = 'Semi-Annually',
  YEARLY = 'Yearly',
}

export enum PackageCategory {
  SHARED_HOSTING = 'Shared Hosting',
  VPS = 'VPS',
  DEDICATED = 'Dedicated Server',
  CLOUD = 'Cloud Hosting',
  WORDPRESS = 'WordPress Hosting',
  RESELLER = 'Reseller Hosting',
}

@Schema({ timestamps: true })
export class HostingPackage {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop()
  originalPrice: number; // For showing discounts (strike-through price)

  @Prop({
    type: String,
    enum: BillingCycle,
    default: BillingCycle.MONTHLY,
  })
  billingCycle: BillingCycle;

  @Prop({
    type: String,
    enum: PackageCategory,
    default: PackageCategory.SHARED_HOSTING,
  })
  category: PackageCategory;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: false })
  isBestValue: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  // Technical Specs
  @Prop()
  storage: string; // e.g., "50GB SSD"

  @Prop()
  bandwidth: string; // e.g., "Unlimited"

  @Prop()
  ram: string; // e.g., "4GB"

  @Prop()
  cpu: string; // e.g., "2 vCPU"

  @Prop()
  domains: string; // e.g., "5 Domains"

  // Promotion
  @Prop()
  discountPercentage: number;

  @Prop()
  promotionEndsAt: Date;

  // New fields for enhanced package management
  @Prop()
  yearlyPrice?: number; // Optional yearly price (calculated if not provided)

  @Prop({ type: 'ObjectId', ref: 'HostingPackage' })
  basePackageId?: string; // Reference to base package for feature stacking

  @Prop({ type: Object })
  benefitHints?: { [key: string]: string }; // Tooltips for technical specs

  createdAt?: Date;
  updatedAt?: Date;
}

export const HostingPackageSchema = SchemaFactory.createForClass(HostingPackage);

// Indexes
HostingPackageSchema.index({ category: 1 });
HostingPackageSchema.index({ isActive: 1 });
HostingPackageSchema.index({ isPopular: 1 });
HostingPackageSchema.index({ sortOrder: 1 });
HostingPackageSchema.index({ price: 1 });

