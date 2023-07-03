import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { FileTypes, IBufferedFile } from '../types/File';
import * as crypto from 'crypto';

@Injectable()
export class MinioClientService {
  constructor(private readonly minio: MinioService) {}
  private readonly bucketName = process.env.MINIO_BUCKET_NAME;

  public async upload(
    file: IBufferedFile,
    bucketName: string = this.bucketName,
  ): Promise<string> {
    const { buffer, mimetype, originalname } = file;

    if (!FileTypes.some((type) => type === mimetype)) {
      throw new BadRequestException('File type not supported!');
    }

    const timestamp = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');
    const extension = originalname.substring(
      originalname.lastIndexOf('.'),
      originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
    };
    const fileName = hashedFileName + extension;

    this.minio.client.putObject(bucketName, fileName, buffer, metaData);

    return fileName;
  }

  async delete(objectName: string, bucketName: string = this.bucketName) {
    await this.minio.client.removeObject(bucketName, objectName);
  }
}
