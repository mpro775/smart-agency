import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamMemberDocument = TeamMember & Document;

export enum Department {
  MANAGEMENT = 'Management',
  BACKEND = 'Backend',
  FRONTEND = 'Frontend',
  MOBILE = 'Mobile',
  DEVOPS = 'DevOps',
  DESIGN = 'Design',
  QA = 'Quality Assurance',
  MARKETING = 'Marketing',
  SUPPORT = 'Support',
}

@Schema({ timestamps: true })
export class TeamMember {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  role: string; // e.g., "Senior Backend Developer"

  @Prop({
    type: String,
    enum: Department,
    default: Department.BACKEND,
  })
  department: Department;

  @Prop()
  photo: string;

  @Prop()
  bio: string; // Short bio

  @Prop()
  email: string;

  // Social Links
  @Prop()
  linkedinUrl: string;

  @Prop()
  githubUrl: string;

  @Prop()
  twitterUrl: string;

  @Prop()
  websiteUrl: string;

  // Skills & Specializations
  @Prop({ type: [String], default: [] })
  specializations: string[]; // ["Nest.js", "Docker", "AWS"]

  // Display Options
  @Prop({ default: true })
  showOnHome: boolean; // Show on homepage

  @Prop({ default: true })
  showOnAbout: boolean; // Show on about page

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  // Work stats (optional - for showcasing)
  @Prop({ default: 0 })
  projectsCount: number;

  @Prop()
  joinedAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);

// Indexes
TeamMemberSchema.index({ isActive: 1 });
TeamMemberSchema.index({ showOnHome: 1 });
TeamMemberSchema.index({ department: 1 });
TeamMemberSchema.index({ sortOrder: 1 });

