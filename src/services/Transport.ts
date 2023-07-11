import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { Transport, TransportDocument } from '../db/schemas/Transport';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTransportDto } from '../dtos/CreateTransport';
import { ResponseResult } from '../utils/Response';
import { Request, Response } from 'express';
import {
  AffectedResult,
  ResponseBody,
  ItemsPaginated,
  TransportWhere,
  PaginationMeta,
} from '../types';
import { UpdateTransportDto } from '../dtos/UpdateTransport';
import { File, FileDocument } from '../db/schemas/File';
import { MinioClientService } from './Minio';
import { getImageRootPath } from '../utils/utils';

@Injectable()
export class TransportService {
  private logger: Logger;
  constructor(
    @InjectModel(Transport.name)
    private readonly transportModel: Model<Transport>,
    @InjectModel(File.name) private readonly fileModel: Model<File>,
    private readonly minioClientService: MinioClientService,
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
    req: Request,
  ): Promise<Response<ResponseBody<TransportDocument>>> {
    try {
      const { title, price, status, description, imageId } = createTransportDto;

      const [transport, file] = await Promise.all([
        this.transportModel.create({
          title,
          price,
          status,
          description,
        }),
        this.fileModel.findById(imageId),
      ]);

      if (file && transport) {
        await this.transportModel.findByIdAndUpdate(transport._id, {
          $set: { image: file },
        });
      }

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.CREATED,
        'Transport created successfully.',
        {
          ...transport.toObject(),
          image: file
            ? {
                ...file.toObject(),
                fileSrc: getImageRootPath(req).concat('/', file.fileSrc),
              }
            : undefined,
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
      const { description, transport, imageId } = updateTransportDto;
      let file: FileDocument;

      const updatedTransport = await this.transportModel.findByIdAndUpdate(
        id,
        {
          $set: {
            ...transport,
            description,
          },
        },
        { populate: { path: 'image' } },
      );

      if (!updatedTransport) {
        return ResponseResult.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'Transport not found.',
        );
      }

      if (updatedTransport && imageId) {
        file = await this.fileModel.findById(imageId);

        if (file) {
          await Promise.all([
            this.fileModel.deleteOne({
              $and: [{ fileSrc: { $eq: updatedTransport.image.fileSrc } }],
            }),
            this.minioClientService.delete(updatedTransport.image.fileSrc),
          ]);
          updatedTransport.image = file;
          await updatedTransport.save();
        }
      }

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'Transport updated successfully.',
        {
          ...updatedTransport.toObject(),
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
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    try {
      const deletedTransport = await this.transportModel.findByIdAndDelete(id, {
        populate: { path: 'image' },
      });

      if (!deletedTransport) {
        return ResponseResult.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'Transport not found.',
        );
      }

      if (deletedTransport) {
        await Promise.all([
          this.fileModel.deleteOne({
            $and: [{ fileSrc: { $eq: deletedTransport.image.fileSrc } }],
          }),
          this.minioClientService.delete(deletedTransport.image.fileSrc),
        ]);
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
    req: Request,
  ): Promise<Response<ResponseBody<TransportDocument>>> {
    try {
      const transport = await this.transportModel.findOne(
        options,
        {},
        { populate: { path: 'image' } },
      );

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
        {
          ...transport.toObject(),
          image: {
            ...transport.image.toObject(),
            fileSrc: getImageRootPath(req).concat('/', transport.image.fileSrc),
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
   * Finds and returns a paginated list of transports based on the provided criteria.
   *
   * @param {TransportWhere} where - The criteria used to filter the transports.
   * @param {Response} res - The response object used to send the result.
   * @return {Promise<Response<ResponseBody>>} A promise that resolves to the response object containing the paginated list of transports.
   */
  public async findPaginated(
    where: TransportWhere,
    res: Response,
    req: Request,
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
          .populate({ path: 'image' })
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

      const mapped = transports.map((item) => ({
        ...item.toObject(),
        image: item.image
          ? {
              ...item.image.toObject(),
              fileSrc: getImageRootPath(req).concat('/', item.image.fileSrc),
            }
          : undefined,
      }));

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'Transport found successfully.',
        {
          items: mapped,
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
      options.$and.push({ 'description.color': { $eq: color } });
    }
    if (licenceType) {
      options.$and.push({ 'description.licenceType': { $eq: licenceType } });
    }
    if (priceRange && Array.isArray(priceRange)) {
      options.$and.push({
        price: {
          $gte:
            typeof priceRange[0] === 'number'
              ? priceRange[0]
              : Number.parseInt(priceRange[0]),
          $lte:
            typeof priceRange[1] === 'number'
              ? priceRange[1]
              : Number.parseInt(priceRange[1]),
        },
      });
    }
    if (maxSpeed) {
      options.$and.push({
        'description.maxSpeed': {
          $gte:
            typeof maxSpeed === 'number' ? maxSpeed : Number.parseInt(maxSpeed),
        },
      });
    }
    if (powerRange && Array.isArray(powerRange)) {
      options.$and.push({
        'description.power': {
          $gte:
            typeof powerRange[0] === 'number'
              ? powerRange[0]
              : Number.parseInt(powerRange[0]),
          $lte:
            typeof powerRange[1] === 'number'
              ? powerRange[1]
              : Number.parseInt(powerRange[1]),
        },
      });
    }
    if (search) {
      options.$or.push({ title: { $regex: search, $options: 'i' } });
    }
    if (type) {
      options.$and.push({ 'description.type': { $eq: type } });
    }

    if (options.$and.length === 0) {
      delete options.$and;
    }
    if (options.$or.length === 0) {
      delete options.$or;
    }

    return options;
  }
}
