import { Prop, Schema } from '@nestjs/mongoose';
import { User } from './User';
import { Schema as MongooseSchema } from 'mongoose';
import { Transport } from './Transport';

@Schema({ timestamps: true })
export class Rent {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Transport.name })
  transport: Transport;

  @Prop({ required: true, type: Date })
  fromDate: Date;

  @Prop({ required: false, type: Date })
  toDate?: Date;

  @Prop({ required: true, type: Date })
  stoppedAt?: Date;
}
