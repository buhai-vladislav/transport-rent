import { Module } from '@nestjs/common';
import { Transport, TransportSchema } from '../db/schemas/Transport';
import { MongooseModule } from '@nestjs/mongoose';
import { TransportService } from '../services/Transport';
import { TransportController } from '../controllers/Transport';
import { File, FileSchema } from '../db/schemas/File';
import { MinioClientModule } from './Minio';
import { Rent, RentSchema } from '../db/schemas/Rent';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transport.name, schema: TransportSchema },
      { name: File.name, schema: FileSchema },
      { name: Rent.name, schema: RentSchema },
    ]),
    MinioClientModule,
  ],
  controllers: [TransportController],
  providers: [TransportService],
})
export class TransportModule {}
