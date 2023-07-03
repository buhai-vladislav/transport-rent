import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rent, RentSchema } from 'src/db/schemas/Rent';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rent.name, schema: RentSchema }]),
  ],
})
export class RentModule {}
