import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from '../db/schemas/File';
import { MinioClientModule } from './Minio';
import { FileController } from '../controllers/File';
import { FileService } from '../services/File';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MinioClientModule,
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
