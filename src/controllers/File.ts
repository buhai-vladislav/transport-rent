import {
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/File';
import { FileDocument } from '../db/schemas/File';

import type { IBufferedFile, ResponseBody } from '../types';
import { Request, Response } from 'express';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile() file: IBufferedFile,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<FileDocument>>> {
    return this.fileService.upload(file, req, res);
  }
}
