import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
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
import { Request, Response } from 'express';
import {
  LicenceType,
  TransportDocument,
  TransportType,
} from '../db/schemas/Transport';
import { CreateTransportDto, UpdateTransportDto } from '../dtos';
import { TransportService } from '../services/Transport';
import {
  AffectedResult,
  ResponseBody,
  ItemsPaginated,
  TransportWhere,
} from '../types';
import { SortOrder } from '../types/Where';
import {
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_LIMIT,
  JWT_BEARER_SWAGGER_AUTH_NAME,
} from '../utils/constants';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiOkResponsePaginated,
} from 'src/decorators';
import { Rent } from 'src/types/Rent';

@ApiTags('Transports')
@Controller('transports')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @ApiOperation({ summary: 'Creating transport process.' })
  @ApiSuccessResponse(
    Rent,
    'The transport successfully created.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @ApiBody({
    type: CreateTransportDto,
  })
  @Post()
  public async create(
    @Body() createTransportDto: CreateTransportDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response<ResponseBody<TransportDocument>>> {
    return this.transportService.create(createTransportDto, res, req);
  }

  @ApiOperation({ summary: 'Updating transport process.' })
  @ApiSuccessResponse(
    Rent,
    'The transport successfully updated.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @ApiBody({
    type: UpdateTransportDto,
  })
  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateTrasnportDto: UpdateTransportDto,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<TransportDocument>>> {
    return this.transportService.update(id, updateTrasnportDto, res);
  }

  @ApiOperation({ summary: 'Deleting transport process.' })
  @ApiSuccessResponse(
    Rent,
    'The transport successfully deleted.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @Delete('/:id')
  public async delete(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    return this.transportService.delete(id, res);
  }

  @ApiOperation({ summary: 'Getting single transport process.' })
  @ApiSuccessResponse(
    Rent,
    'The transport successfully retrieved.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @Get('/:id')
  public async findById(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response<ResponseBody<TransportDocument>>> {
    return this.transportService.findOne(
      { $and: [{ _id: { $eq: id } }] },
      res,
      req,
    );
  }

  @ApiOperation({ summary: 'Fethching transport list process.' })
  @ApiOkResponsePaginated(
    Rent,
    'The transports successfully retrieved.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
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
    name: 'search',
    type: String,
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
    required: false,
    enum: [
      'createdAt',
      'price',
      'title',
      'status',
      'description.maxSpeed',
      'description.type',
      'description.weight',
      'description.seats',
      'description.power',
      'description.licenceType',
    ],
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'type',
    enum: TransportType,
    example: TransportType.CAR,
    required: false,
  })
  @ApiQuery({
    name: 'color',
    type: String,
    required: false,
    example: '#ffffff',
  })
  @ApiQuery({
    name: 'licenceType',
    enum: LicenceType,
    required: false,
    example: LicenceType.A,
  })
  @ApiQuery({
    name: 'powerRange',
    type: [Number],
    required: false,
    example: [0, 100],
  })
  @ApiQuery({
    name: 'priceRange',
    type: [Number],
    required: false,
    example: [0, 100],
  })
  @ApiQuery({
    name: 'maxSpeed',
    type: Number,
    required: false,
    example: 100,
  })
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
    @Res() res: Response,
    @Req() req: Request,
    @Query('search') search?: string,
    @Query('sortOrder') sortOrder?: SortOrder,
    @Query('sortKey') sortKey?: string,
    @Query('type') type?: TransportType,
    @Query('color') color?: string,
    @Query('licenceType') licenceType?: LicenceType,
    @Query('powerRange') powerRange?: [number, number] | [string, string],
    @Query('priceRange') priceRange?: [number, number] | [string, string],
    @Query('maxSpeed') maxSpeed?: number,
  ): Promise<Response<ResponseBody<ItemsPaginated<TransportDocument>>>> {
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
    return this.transportService.findPaginated(where, res, req);
  }
}
