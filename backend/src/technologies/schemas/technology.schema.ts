import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TechnologyDocument = Technology & Document;

export enum TechnologyCategory {
  BACKEND = 'Backend',
  FRONTEND = 'Frontend',
  MOBILE = 'Mobile',
  DEVOPS = 'DevOps',
  AUTOMATION = 'Automation',
  DATABASE = 'Database',
  OTHER = 'Other',
}

@Schema({ timestamps: true })
export class Technology {
  @Prop({ required: true })
  name: string;

  @Prop()
  icon: string;

  @Prop({
    type: String,
    enum: TechnologyCategory,
    default: TechnologyCategory.OTHER,
  })
  category: TechnologyCategory;

  @Prop()
  description: string;

  @Prop()
  tooltip?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TechnologySchema = SchemaFactory.createForClass(Technology);

// Indexes
TechnologySchema.index({ name: 1 });
TechnologySchema.index({ category: 1 });
