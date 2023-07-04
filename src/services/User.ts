import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from '../db/schemas/User';
import { CreateUserDto } from '../dtos/CreateUser';
import { ResponseResult } from '../utils/Response';
import { Request, Response } from 'express';
import { Hashing } from '../utils/Hashing';
import { RemoveResult, ResponseBody } from '../types/Response';
import { UpdateUserDto } from '../dtos/UpdateUser';
import { File, FileDocument } from '../db/schemas/File';
import { getImageRootPath } from '../utils/utils';
import { MinioClientService } from './Minio';

@Injectable()
export class UserService {
  private logger: Logger;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(File.name) private readonly fileModel: Model<File>,
    private readonly minioClientService: MinioClientService,
  ) {
    this.logger = new Logger(UserService.name);
  }

  /**
   * Creates a new user.
   *
   * @param {CreateUserDto} createUserDto - The user data to create.
   * @param {Response} res - The response object.
   * @return {Promise<Response<ResponseBody>>} The response with the created user.
   */
  public async create(
    createUserDto: CreateUserDto,
    res: Response,
    req: Request,
  ): Promise<Response<ResponseBody<UserDocument>>> {
    try {
      const { email, name, password, imageId } = createUserDto;
      const passHash = await Hashing.generatePasswordHash(password);

      const file = await this.fileModel.findById(imageId);

      const user = await this.userModel.create({
        email,
        name,
        password: passHash,
      });

      if (file && user) {
        await this.userModel.findByIdAndUpdate(user._id, {
          $set: { image: file },
        });
      }

      const { password: _, ...result } = user.toObject();

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.CREATED,
        'User created successfully.',
        {
          ...result,
          image: {
            ...file.toObject(),
            fileSrc: getImageRootPath(req).concat('/', file.fileSrc),
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
   * Updates a user.
   *
   * @param {string} userId - The ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - The DTO containing the updated user information.
   * @param {Response} res - The response object.
   * @return {Promise<Response<ResponseBody>>} A promise that resolves to the updated user response.
   */
  public async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
    res: Response,
    req: Request,
  ): Promise<Response<ResponseBody<UserDocument>>> {
    try {
      const { email, name, imageId } = updateUserDto;
      let file: FileDocument;

      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            email,
            name,
          },
        },
        {
          populate: { path: 'image' },
        },
      );

      if (user && imageId) {
        file = await this.fileModel.findById(imageId);

        if (file) {
          await Promise.all([
            this.fileModel.deleteOne({
              $and: [{ fileSrc: { $eq: user.image.fileSrc } }],
            }),
            this.minioClientService.delete(user.image.fileSrc),
          ]);
          user.image = file;
          await user.save();
        }
      }

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'User updated successfully.',
        {
          ...user.toObject(),
          name: name ?? user.name,
          email: email ?? user.email,
          password: undefined,
          image: file
            ? {
                ...file.toObject(),
                fileSrc: getImageRootPath(req).concat('/', file.fileSrc),
              }
            : user.image,
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
   * Find and return a user based on the provided options.
   *
   * @param {FilterQuery<User>} options - The options to filter the user.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<Response<ResponseBody>>} A promise that resolves with the response.
   */
  public async findOne(
    options: FilterQuery<User>,
    res: Response,
    req: Request,
  ): Promise<Response<ResponseBody<UserDocument>>> {
    try {
      const user = await this.userModel.findOne(
        options,
        {},
        { populate: { path: 'image' } },
      );

      if (!user) {
        return ResponseResult.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'User not found.',
          null,
        );
      }

      const { password, ...newUser } = user.toObject();

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'User found successfully.',
        {
          ...newUser,
          image: newUser.image
            ? {
                ...newUser.image,
                fileSrc: getImageRootPath(req).concat(
                  '/',
                  newUser.image.fileSrc,
                ),
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
   * Resets the password for a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {UpdateUserDto} updateUserDto - The DTO containing the updated user data.
   * @param {Response} res - The response object.
   * @return {Promise<Response<ResponseBody>>} - A promise that resolves to the response with a response body.
   */
  public async resetPassword(
    userId: string,
    updateUserDto: UpdateUserDto,
    res: Response,
  ): Promise<Response<ResponseBody<RemoveResult>>> {
    try {
      const { password } = updateUserDto;
      const passHash = await Hashing.generatePasswordHash(password);

      const user = await this.userModel.findOneAndUpdate(
        { $and: [{ _id: { $eq: userId } }] },
        { $set: { password: passHash } },
      );

      if (!user) {
        return ResponseResult.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'User not found.',
          null,
        );
      }

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'User updated successfully.',
        {
          isAffected: !!user,
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
