import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppMimeType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/jpg'
  | 'application/octet-stream';

@Schema({ timestamps: true, collection: 'files' })
export class File {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  encoding: string;

  @Prop({ required: true, type: String })
  mimetype: AppMimeType;

  @Prop({ required: true, type: Number })
  size: number;

  @Prop({ required: true, type: String })
  fileSrc?: string;
}

export type FileDocument = HydratedDocument<File>;
export const FileSchema = SchemaFactory.createForClass(File);
