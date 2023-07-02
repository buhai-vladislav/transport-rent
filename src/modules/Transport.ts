import { Module } from '@nestjs/common';
import { Transport, TransportSchema } from '../db/schemas/Transport';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transport.name, schema: TransportSchema },
    ]),
  ],
})
export class TransportModule {}
