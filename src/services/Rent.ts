import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rent, RentDocument } from '../db/schemas/Rent';
import { CreateRentDto, UpdateRentDto } from '../dtos';
import { ResponseResult } from '../utils/Response';
import { Request, Response } from 'express';
import { RentStatus, Transport } from '../db/schemas/Transport';
import { PaginationMeta, ResponseBody, Where, ItemsPaginated } from '../types';
import { getImageRootPath } from '../utils/utils';

@Injectable()
export class RentService {
  private logger: Logger;
  constructor(
    @InjectModel(Rent.name) private readonly rentModel: Model<Rent>,
    @InjectModel(Transport.name)
    private readonly transportModel: Model<Transport>,
  ) {
    this.logger = new Logger(RentService.name);
  }

  /**
   * Create a new rent for a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {CreateRentDto} createRentDto - The DTO containing the details of the rent.
   * @param {Response} res - The response object.
   * @return {Promise<void>} A Promise that resolves when the rent is created.
   */
  async create(
    userId: string,
    createRentDto: CreateRentDto,
    res: Response,
  ): Promise<Response<ResponseBody<RentDocument>>> {
    try {
      const { transportId, fromDate, toDate } = createRentDto;
      const transport = await this.transportModel.findById(transportId);

      if (!transport) {
        return ResponseResult.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'Transport not found.',
        );
      }

      transport.status = RentStatus.IN_RENT;
      const [createdRent] = await Promise.all([
        this.rentModel.create({
          user: { _id: userId },
          transport: { _id: transportId },
          fromDate,
          toDate,
        }),
        transport.save(),
      ]);

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.CREATED,
        'Transport rented successfully.',
        createdRent,
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
   * Updates a rent record in the database.
   *
   * @param {string} id - The ID of the rent record to update.
   * @param {UpdateRentDto} updateRentDto - The data to update the rent record with.
   * @param {Response} res - The response object to send the result to.
   */
  public async update(
    id: string,
    updateRentDto: UpdateRentDto,
    res: Response,
  ): Promise<Response<ResponseBody<RentDocument>>> {
    try {
      const { fromDate, toDate, stoppedAt, transportId } = updateRentDto;
      const rent = await this.rentModel.findById(id);

      if (!rent) {
        return ResponseResult.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'Rent not found.',
        );
      }

      if (fromDate) {
        rent.fromDate = fromDate;
      }
      if (toDate) {
        rent.toDate = toDate;
      }
      if (stoppedAt) {
        rent.stoppedAt = stoppedAt;
        await this.transportModel.findByIdAndUpdate(transportId, {
          $set: { status: RentStatus.FREE },
        });
      }

      await rent.save();

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'Rent updated successfully.',
        {
          ...rent.toObject(),
          fromDate: fromDate ?? rent.fromDate,
          toDate: toDate ?? rent.toDate,
          stoppedAt: stoppedAt ?? rent.stoppedAt,
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
   * Retrieves a list of rents for a given user ID and returns the result as a response.
   *
   * @param {string} userId - The ID of the user.
   * @param {Where} where - An object containing search parameters.
   * @param {Response} res - The response object to send the result back.
   * @return {Promise<void>} - A promise that resolves when the result is sent as a response.
   */
  public async getRentList(
    userId: string,
    where: Where,
    res: Response,
    req: Request,
  ): Promise<Response<ResponseBody<ItemsPaginated<RentDocument>>>> {
    try {
      const { limit, page, sortOrder, sortKey } = where;
      const skip = page >= 1 ? (page - 1) * limit : limit;
      const sortOptions = {};

      if (sortKey && sortOrder) {
        const order = sortOrder === 'ASC' ? 1 : -1;
        sortOptions[sortKey] = order;
      }

      const [rents, count] = await Promise.all([
        this.rentModel
          .find(
            { user: { $eq: userId } },
            {},
            {
              populate: [
                { path: 'transport', populate: { path: 'image' } },
                { path: 'user' },
              ],
            },
          )
          .sort(sortOptions)
          .limit(limit)
          .skip(skip),
        this.rentModel.countDocuments({ user: { $eq: userId } }),
      ]);

      const totalPages = Math.ceil(count / limit);
      const pagination: PaginationMeta = {
        page,
        limit,
        totalPages,
        count,
      };

      const items = rents.map((rent) => {
        return {
          ...rent.toObject(),
          transport: {
            ...rent.transport.toObject(),
            image: {
              ...rent.transport.image.toObject(),
              fileSrc: getImageRootPath(req).concat(
                '/',
                rent.transport.image.fileSrc,
              ),
            },
          },
        };
      });

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'Rent found successfully.',
        {
          items,
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

  public async checkIsCurrentUserRent(
    userId: string,
    transportId: string,
    res: Response,
  ): Promise<Response<ResponseBody<RentDocument>>> {
    try {
      const rent = await this.rentModel.findOne({
        $and: [
          { user: { $eq: userId } },
          { transport: { $eq: transportId } },
          { stoppedAt: { $eq: null } },
        ],
      });

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'Rent found.',
        rent,
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
}
