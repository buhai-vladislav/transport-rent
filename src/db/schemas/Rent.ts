import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User, UserDocument } from './User';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Transport, TransportDocument } from './Transport';

@Schema({ timestamps: true })
export class Rent {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  user: UserDocument;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Transport.name })
  transport: TransportDocument;

  @Prop({ required: true, type: Date })
  fromDate: Date;

  @Prop({ required: false, type: Date })
  toDate?: Date;

  @Prop({ required: false, type: Date, default: null })
  stoppedAt?: Date;
}

export const RentSchema = SchemaFactory.createForClass(Rent);
export type RentDocument = HydratedDocument<Rent>;
