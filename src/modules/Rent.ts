import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RentController } from '../controllers/Rent';
import { Rent, RentSchema } from '../db/schemas/Rent';
import { Transport, TransportSchema } from '../db/schemas/Transport';
import { RentService } from '../services/Rent';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rent.name, schema: RentSchema },
      { name: Transport.name, schema: TransportSchema },
    ]),
  ],
  controllers: [RentController],
  providers: [RentService],
})
export class RentModule {}
