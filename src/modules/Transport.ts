import { Module } from '@nestjs/common';
import { Transport, TransportSchema } from '../db/schemas/Transport';
import { MongooseModule } from '@nestjs/mongoose';
import { TransportService } from '../services/Transport';
import { TransportController } from '../controllers/Transport';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transport.name, schema: TransportSchema },
    ]),
  ],
  controllers: [TransportController],
  providers: [TransportService],
})
export class TransportModule {}
