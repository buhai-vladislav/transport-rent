import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'tokens' })
export class Token {
  @Prop({ required: true, type: String })
  token: string;
}

export type TokenDocument = HydratedDocument<Token>;
export const TokenSchema = SchemaFactory.createForClass(Token);
