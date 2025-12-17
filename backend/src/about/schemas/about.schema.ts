import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AboutDocument = About & Document;

class HeroSection {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: false })
  image?: string;
}

class ValueItem {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

class StatItem {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  label: string;
}

class CTASection {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  buttonText: string;
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

  @Prop({ type: [Object], required: true, default: [] })
  values: ValueItem[];

  @Prop({ type: [Object], required: true, default: [] })
  stats: StatItem[];

  @Prop({ type: Object, required: true })
  cta: CTASection;

  @Prop({ default: true })
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const AboutSchema = SchemaFactory.createForClass(About);
