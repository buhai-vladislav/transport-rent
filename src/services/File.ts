import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IBufferedFile } from '../types/File';
import { getImageRootPath } from '../utils/utils';
import { MinioClientService } from './Minio';
import { Request, Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from '../db/schemas/File';
import { Model } from 'mongoose';
import { ResponseResult } from '../utils/Response';
import { ResponseBody, RemoveResult } from '../types';

@Injectable()
export class FileService {
  private logger: Logger;
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<File>,
    private readonly minioClientService: MinioClientService,
  ) {
    this.logger = new Logger(FileService.name);
  }

  public async upload(
    file: IBufferedFile,
    req: Request,
    res: Response,
  ): Promise<Response<ResponseBody<FileDocument>>> {
    const { encoding, originalname, size, mimetype } = file;
    try {
      const fileSrc = await this.minioClientService.upload(file);
      const path = getImageRootPath(req);

      const createdFile = await this.fileModel.create({
        encoding,
        name: originalname,
        size,
        mimetype,
        fileSrc,
      });
      createdFile.fileSrc = path.concat('/', createdFile.fileSrc);

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.CREATED,
        'File uploaded successfully.',
        createdFile,
      );
    } catch (error) {
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  public async delete(
    fileId: string,
    res: Response,
  ): Promise<Response<ResponseBody<RemoveResult>>> {
    try {
      const file = await this.fileModel.findById(fileId);

      if (!file) {
        throw new BadRequestException('File to delete not found!');
      }

      const { fileSrc } = file;

      if (fileSrc) {
        await this.minioClientService.delete(fileSrc);
      }

      const fileDeleteResult = await this.fileModel.findByIdAndDelete(fileId);

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'File deleted successfully.',
        { isAffected: !!fileDeleteResult },
      );
    } catch (error) {
      this.logger.error(error);
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }
}
