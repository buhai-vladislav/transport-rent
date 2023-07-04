import {
  Controller,
  HttpStatus,
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse, ApiErrorResponse } from '../decorators';
import { Rent } from '../types/Rent';
import { PublicRoute } from '../guards/PublicRoute';

@ApiTags('File')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: 'Uploading file process.' })
  @ApiSuccessResponse(
    Rent,
    'The transport successfully rented.',
    HttpStatus.CREATED,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @PublicRoute()
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
