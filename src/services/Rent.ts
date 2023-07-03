import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rent } from 'src/db/schemas/Rent';
import { CreateRentDto, UpdateRentDto } from '../dtos';
import { ResponseResult } from '../utils/Response';
import { Response } from 'express';
import { RentStatus, Transport } from '../db/schemas/Transport';
import { PaginationMeta, Where } from 'src/types';

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

  async create(userId: string, createRentDto: CreateRentDto, res: Response) {
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

  public async update(id: string, updateRentDto: UpdateRentDto, res: Response) {
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
  public async getRentList(userId: string, where: Where, res: Response) {
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
          .find({ user: { _id: { $eq: userId } } })
          .sort(sortOptions)
          .limit(limit)
          .skip(skip),
        this.rentModel.countDocuments({ user: { _id: { $eq: userId } } }),
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
        'Rent found successfully.',
        {
          items: rents,
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
}
