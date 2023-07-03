import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { CreateRentDto, UpdateRentDto } from '../dtos';
import { RentService } from '../services/Rent';
import { Response } from 'express';
import { SortOrder } from '../types/Where';
import {
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_LIMIT,
} from '../utils/constants';
import { RentDocument } from '../db/schemas/Rent';
import { ItemsPaginated, ResponseBody } from '../types';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Post()
  public async create(
    @Body() createRentDto: CreateRentDto,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<Response<ResponseBody<RentDocument>>> {
    const id = req?.user?.id;
    return this.rentService.create(id, createRentDto, res);
  }

  @Put('/:id')
  public async update(
    @Body() updateRentDto: UpdateRentDto,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<RentDocument>>> {
    return this.rentService.update(id, updateRentDto, res);
  }

  @Get()
  public async getRentList(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGINATION_PAGE), ParseIntPipe)
    page: number,
    @Query(
      'limit',
      new DefaultValuePipe(DEFAULT_PAGINATION_LIMIT),
      ParseIntPipe,
    )
    limit: number,
    @Query('sortOrder') sortOrder: SortOrder = SortOrder.ASC,
    @Query('sortKey') sortKey: string,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<ItemsPaginated<RentDocument>>>> {
    const id = req?.user?.id;
    return this.rentService.getRentList(
      id,
      {
        limit,
        page,
        sortKey,
        sortOrder,
      },
      res,
    );
  }
}
