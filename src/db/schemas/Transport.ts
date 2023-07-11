import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { FileDocument } from './File';

export enum TransportType {
  CAR = 'CAR',
  BUS = 'BUS',
  TRUCK = 'TRUCK',
  BIKE = 'BIKE',
  BICYCLE = 'BICYCLE',
}

export enum RentStatus {
  IN_RENT = 'PENDING',
  FREE = 'FREE',
}

export enum LicenceType {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export class Description {
  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: Number })
  maxSpeed: number;

  @Prop({ required: true, enum: TransportType })
  type: TransportType;

  @Prop({ required: true, type: Number })
  weight: number;

  @Prop({ required: true, type: Number })
  seats: number;

  @Prop({ required: true, type: Number })
  power: number;

  @Prop({ required: true, type: Number })
  color: string;

  @Prop({ required: false, enum: LicenceType, default: null })
  licenceType?: LicenceType;
}

@Schema({ timestamps: true, collection: 'transports' })
export class Transport {
  @Prop({ required: true, type: String })
  price: number;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: Description })
  description: Description;

  @Prop({ required: true, enum: RentStatus, default: RentStatus.FREE })
  status: RentStatus;

  @Prop({
    ref: 'File',
    type: MongooseSchema.Types.ObjectId,
    required: false,
  })
  image?: FileDocument;
}

export type TransportDocument = HydratedDocument<Transport>;
export const TransportSchema = SchemaFactory.createForClass(Transport);
