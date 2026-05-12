import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AboutDocument = About & Document;

class HeroSection {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: false })
  badge?: string;

  @Prop({ required: false })
  image?: string;

  @Prop({ required: false })
  primaryButtonText?: string;

  @Prop({ required: false })
  primaryButtonUrl?: string;

  @Prop({ required: false })
  secondaryButtonText?: string;

  @Prop({ required: false })
  secondaryButtonUrl?: string;

  @Prop({ type: [String], default: [] })
  trustBadges?: string[];
}

class StorySection {
  @Prop({ required: false })
  title?: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [String], default: [] })
  painPoints?: string[];

  @Prop({ required: false })
  closingStatement?: string;
}

class ThinkingItem {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  result?: string;
}

class DifferentiatorItem {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  badge?: string;
}

class ProcessStep {
  @Prop({ required: true })
  step: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  deliverable?: string;

  @Prop({ required: false })
  icon?: string;
}

class PrincipleItem {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  example?: string;
}

class StatItem {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  label: string;

  @Prop({ required: false })
  suffix?: string;

  @Prop({ required: false })
  description?: string;
}

class TeamNoteSection {
  @Prop({ required: false })
  title?: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [String], default: [] })
  highlights?: string[];

  @Prop({ required: false })
  image?: string;
}

class CTASection {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  buttonText: string;

  @Prop({ required: false })
  buttonUrl?: string;

  @Prop({ required: false })
  secondaryButtonText?: string;

  @Prop({ required: false })
  secondaryButtonUrl?: string;
}

class SEOSection {
  @Prop({ required: false })
  metaTitle?: string;

  @Prop({ required: false })
  metaDescription?: string;

  @Prop({ type: [String], default: [] })
  keywords?: string[];

  @Prop({ required: false })
  ogImage?: string;
}

@Schema({ timestamps: true })
export class About {
  @Prop({ type: Object, required: true })
  hero: HeroSection;

  @Prop({ required: true })
  vision: string;

  @Prop({ required: true })
  mission: string;

  @Prop({ required: true })
  approach: string;

  @Prop({ type: Object, required: false })
  story?: StorySection;

  @Prop({ type: [Object], default: [] })
  thinking?: ThinkingItem[];

  @Prop({ type: [Object], default: [] })
  differentiators?: DifferentiatorItem[];

  @Prop({ type: [Object], default: [] })
  process?: ProcessStep[];

  @Prop({ type: [Object], required: true, default: [] })
  values: PrincipleItem[];

  @Prop({ type: [Object], required: true, default: [] })
  stats: StatItem[];

  @Prop({ type: Object, required: false })
  teamNote?: TeamNoteSection;

  @Prop({ type: Object, required: true })
  cta: CTASection;

  @Prop({ type: Object, required: false })
  seo?: SEOSection;

  @Prop({ default: true })
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const AboutSchema = SchemaFactory.createForClass(About);
