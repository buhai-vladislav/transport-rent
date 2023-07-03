import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LicenceType, TransportType } from '../db/schemas/Transport';
import { CreateTransportDto, UpdateTransportDto } from '../dtos';
import { TransportService } from '../services/Transport';
import { ResponseBody, TransportWhere } from '../types';
import { SortOrder } from '../types/Where';
import {
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_LIMIT,
} from 'src/utils/constants';

@Controller('transports')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post()
  public async create(
    @Body() createTransportDto: CreateTransportDto,
    @Res() res: Response,
  ): Promise<Response<ResponseBody>> {
    return this.transportService.create(createTransportDto, res);
  }

  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateTrasnportDto: UpdateTransportDto,
    @Res() res: Response,
  ): Promise<Response<ResponseBody>> {
    return this.transportService.update(id, updateTrasnportDto, res);
  }

  @Delete('/:id')
  public async delete(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<ResponseBody>> {
    return this.transportService.delete(id, res);
  }

  @Get('/:id')
  public async findById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<ResponseBody>> {
    return this.transportService.findOne({ $and: [{ _id: { $eq: id } }] }, res);
  }

  @Get()
  public async findPaginated(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGINATION_PAGE), ParseIntPipe)
    page: number,
    @Query(
      'limit',
      new DefaultValuePipe(DEFAULT_PAGINATION_LIMIT),
      ParseIntPipe,
    )
    limit: number,
    @Query('search') search: string,
    @Query('sortOrder') sortOrder: SortOrder = SortOrder.ASC,
    @Query('sortKey') sortKey: string,
    @Query('type') type: TransportType,
    @Query('color') color: string,
    @Query('licenceType') licenceType: LicenceType,
    @Query('powerRange') powerRange: [number, number],
    @Query('priceRange') priceRange: [number, number],
    @Query('maxSpeed') maxSpeed: number,
    @Res() res: Response,
  ): Promise<Response<ResponseBody>> {
    const where: TransportWhere = {
      color,
      licenceType,
      limit,
      maxSpeed,
      page,
      powerRange,
      priceRange,
      search,
      sortKey,
      sortOrder,
      type,
    };
    return this.transportService.findPaginated(where, res);
  }
}
