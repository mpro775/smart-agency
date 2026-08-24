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

  @Prop({ required: false })
  nameEn?: string;

  @Prop()
  description: string;

  @Prop({ required: false })
  descriptionEn?: string;

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

  @Prop({ required: false })
  featuresEn?: string[];

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
  storage: string;

  @Prop({ required: false })
  storageEn?: string; // e.g., "50GB SSD"

  @Prop()
  bandwidth: string;

  @Prop({ required: false })
  bandwidthEn?: string; // e.g., "Unlimited"

  @Prop()
  ram: string;

  @Prop({ required: false })
  ramEn?: string; // e.g., "4GB"

  @Prop()
  cpu: string;

  @Prop({ required: false })
  cpuEn?: string; // e.g., "2 vCPU"

  @Prop()
  domains: string;

  @Prop({ required: false })
  domainsEn?: string; // e.g., "5 Domains"

  // Promotion
  @Prop()
  discountPercentage: number;

  @Prop()
  promotionEndsAt: Date;

  // New fields for enhanced package management
  @Prop()
  yearlyPrice?: number; // Optional yearly price (calculated if not provided)

  @Prop({ type: 'ObjectId', ref: 'HostingPackage' })
  basePackageId?: string;

  @Prop({ type: Object })
  benefitHints?: { [key: string]: string }; // Tooltips for technical specs

  @Prop({ type: Object, required: false })
  benefitHintsEn?: { [key: string]: string };

  createdAt?: Date;
  updatedAt?: Date;
}

export const HostingPackageSchema =
  SchemaFactory.createForClass(HostingPackage);

// Indexes
HostingPackageSchema.index({ category: 1 });
HostingPackageSchema.index({ isActive: 1 });
HostingPackageSchema.index({ isPopular: 1 });
HostingPackageSchema.index({ sortOrder: 1 });
HostingPackageSchema.index({ price: 1 });
