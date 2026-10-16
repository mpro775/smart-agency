import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ManagedAsset {
  @Prop({ required: true }) url: string;
  @Prop({ required: true }) publicId: string;
  @Prop({ required: true }) mimeType: string;
  @Prop({ required: true }) bytes: number;
  @Prop() originalName?: string;
  @Prop() sha256?: string;
  @Prop() width?: number;
  @Prop() height?: number;
}
export const ManagedAssetSchema = SchemaFactory.createForClass(ManagedAsset);
