import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { Transport, TransportDocument } from '../db/schemas/Transport';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTransportDto } from '../dtos/CreateTransport';
import { ResponseResult } from '../utils/Response';
import { Response } from 'express';
import {
  RemoveResult,
  ResponseBody,
  ItemsPaginated,
  TransportWhere,
  PaginationMeta,
} from '../types';
import { UpdateTransportDto } from '../dtos/UpdateTransport';

@Injectable()
export class TransportService {
  private logger: Logger;
  constructor(
    @InjectModel(Transport.name)
    private readonly transportModel: Model<Transport>,
  ) {
    this.logger = new Logger(TransportService.name);
  }

  /**
   * Creates a transport.
   *
   * @param {CreateTransportDto} createTransportDto - The data to create the transport.
   * @param {Response} res - The response object.
   * @return {Promise<Response<ResponseBody>>} A promise that resolves to the response with the created transport.
   */
  public async create(
    createTransportDto: CreateTransportDto,
    res: Response,
  ): Promise<Response<ResponseBody<TransportDocument>>> {
    try {
      const { title, price, status, description } = createTransportDto;
      const transport = await this.transportModel.create({
        title,
        price,
        status,
        description,
      });

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.CREATED,
        'Transport created successfully.',
        transport,
      );
    } catch (error) {
      this.logger.error(error);
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error?.message ?? error,
      );
    }
  }

  /**
   * Updates a transport with the given id.
   *
   * @param {string} id - The id of the transport to update.
   * @param {UpdateTransportDto} updateTransportDto - The data to update the transport with.
   * @param {Response} res - The response object.
   * @return {Promise<void>} A promise that resolves when the transport is updated.
   */
  public async update(
    id: string,
    updateTransportDto: UpdateTransportDto,
    res: Response,
  ) {
    try {
      const { description, transport } = updateTransportDto;

      const updatedTransport = await this.transportModel.findByIdAndUpdate(id, {
        $set: {
          ...transport,
          description,
        },
      });

      if (!updatedTransport) {
        return ResponseResult.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'Transport not found.',
        );
      }

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'Transport updated successfully.',
        {
          ...updatedTransport,
          ...transport,
          description: {
            ...updatedTransport.description,
            ...description,
          },
        },
      );
    } catch (error) {
      this.logger.error(error);
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error?.message ?? error,
      );
    }
  }

  /**
   * Deletes a transport by its ID.
   *
   * @param {string} id - The ID of the transport to be deleted.
   * @param {Response} res - The response object.
   * @return {Promise<Response<ResponseBody>>} A promise that resolves to the response with the deleted transport data or an error message.
   */
  public async delete(
    id: string,
    res: Response,
  ): Promise<Response<ResponseBody<RemoveResult>>> {
    try {
      const deletedTransport = await this.transportModel.findByIdAndDelete(id);

      if (!deletedTransport) {
        return ResponseResult.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'Transport not found.',
        );
      }

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'Transport deleted successfully.',
        { isAffected: !!deletedTransport },
      );
    } catch (error) {
      this.logger.error(error);
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error?.message ?? error,
      );
    }
  }

  /**
   * Finds and returns a single transport based on the provided options.
   *
   * @param {QueryOptions<Transport>} options - The options to filter the transport.
   * @param {Response} res - The response object to send the result.
   * @return {Promise<Response<ResponseBody>>} A promise that resolves to the response with the transport data.
   */
  public async findOne(
    options: QueryOptions<Transport>,
    res: Response,
  ): Promise<Response<ResponseBody<TransportDocument>>> {
    try {
      const transport = await this.transportModel.findOne(options);

      if (!transport) {
        return ResponseResult.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'Transport not found.',
        );
      }

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'Transport found successfully.',
        transport,
      );
    } catch (error) {
      this.logger.error(error);
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error?.message ?? error,
      );
    }
  }

  /**
   * Finds and returns a paginated list of transports based on the provided criteria.
   *
   * @param {TransportWhere} where - The criteria used to filter the transports.
   * @param {Response} res - The response object used to send the result.
   * @return {Promise<Response<ResponseBody>>} A promise that resolves to the response object containing the paginated list of transports.
   */
  public async findPaginated(
    where: TransportWhere,
    res: Response,
  ): Promise<Response<ResponseBody<ItemsPaginated<TransportDocument>>>> {
    try {
      const { limit, page, sortOrder, sortKey } = where;
      const options: QueryOptions<Transport> = this.configureOptions(where);
      const sortOptions = {};
      const skip = page >= 1 ? (page - 1) * limit : limit;

      if (sortKey && sortOrder) {
        const order = sortOrder === 'ASC' ? 1 : -1;
        sortOptions[sortKey] = order;
      }

      const [transports, count] = await Promise.all([
        this.transportModel
          .find(options)
          .sort(sortOptions)
          .skip(skip)
          .limit(limit),
        this.transportModel.countDocuments(options),
      ]);
      const totalPages = Math.ceil(count / limit);
      const pagination: PaginationMeta = {
        page,
        limit,
        totalPages,
        count,
      };

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'Transport found successfully.',
        {
          items: transports,
          pagination,
        },
      );
    } catch (error) {
      this.logger.error(error);
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error?.message ?? error,
      );
    }
  }

  /**
   * Configures options based on the given `where` object.
   *
   * @param {TransportWhere} where - The object containing the configuration options.
   * @return {QueryOptions<Transport>} The configured options object.
   */
  private configureOptions(where: TransportWhere): QueryOptions<Transport> {
    const {
      color,
      licenceType,
      maxSpeed,
      powerRange,
      priceRange,
      search,
      type,
    } = where;
    const options: QueryOptions<Transport> = { $and: [], $or: [] };

    if (color) {
      options.$and.push({ color: { $eq: color } });
    }
    if (licenceType) {
      options.$and.push({ licenceType: { $eq: licenceType } });
    }
    if (priceRange) {
      options.$and.push({
        price: { $gte: priceRange[0], $lte: priceRange[1] },
      });
    }
    if (maxSpeed) {
      options.$and.push({ maxSpeed: { $gte: maxSpeed } });
    }
    if (powerRange) {
      options.$and.push({
        power: { $gte: powerRange[0], $lte: powerRange[1] },
      });
    }
    if (search) {
      options.$or.push({ title: { $regex: search, $options: 'i' } });
    }
    if (type) {
      options.$and.push({ type: { $eq: type } });
    }

    return options;
  }
}
