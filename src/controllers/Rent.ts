import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
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
  JWT_BEARER_SWAGGER_AUTH_NAME,
} from '../utils/constants';
import { RentDocument } from '../db/schemas/Rent';
import { AffectedResult, ItemsPaginated, ResponseBody } from '../types';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Rent } from '../types/Rent';
import {
  ApiOkResponsePaginated,
  ApiErrorResponse,
  ApiSuccessResponse,
} from '../decorators';

@ApiTags('Rent')
@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @ApiOperation({ summary: 'Creating rent process.' })
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
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Post()
  public async create(
    @Body() createRentDto: CreateRentDto,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<Response<ResponseBody<RentDocument>>> {
    const id = req?.user?.id;
    return this.rentService.create(id, createRentDto, res);
  }

  @ApiOperation({ summary: 'Updating rent process.' })
  @ApiSuccessResponse(
    Rent,
    'The transport rent successfully updated.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiBody({ type: UpdateRentDto })
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Put('/:id')
  public async update(
    @Body() updateRentDto: UpdateRentDto,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<RentDocument>>> {
    return this.rentService.update(id, updateRentDto, res);
  }

  @ApiOperation({ summary: 'Getting list of rents process.' })
  @ApiOkResponsePaginated(
    Rent,
    'The transport rent successfully retrieved.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiQuery({
    name: 'page',
    example: DEFAULT_PAGINATION_PAGE,
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    example: DEFAULT_PAGINATION_LIMIT,
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'sortOrder',
    enum: SortOrder,
    example: SortOrder.ASC,
    required: false,
  })
  @ApiQuery({
    name: 'sortKey',
    example: 'createdAt',
    enum: ['fromDate', 'toDate', 'stoppedAt', 'createdAt'],
    type: String,
    required: false,
  })
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
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

  @ApiOperation({ summary: 'Getting rent info for transport process.' })
  @ApiSuccessResponse(
    AffectedResult,
    'The transport rent successfully retrieved.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Get('/:transportId')
  public async checkIsCurrentUserRent(
    @Param('transportId') transportId: string,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    const userId = req.user.id;
    return this.rentService.checkIsCurrentUserRent(userId, transportId, res);
  }
}
