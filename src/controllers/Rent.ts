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
import { CreateRentDto, UpdateRentDto } from 'src/dtos';
import { RentService } from 'src/services/Rent';
import { Response } from 'express';
import { SortOrder } from 'src/types/Where';
import {
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_LIMIT,
} from 'src/utils/constants';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Post()
  public async create(
    @Body() createRentDto: CreateRentDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const id = req?.user?.id;
    return this.rentService.create(id, createRentDto, res);
  }

  @Put('/:id')
  public async update(
    @Body() updateRentDto: UpdateRentDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
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
  ) {
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
