import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from '../db/schemas/User';
import { CreateUserDto } from '../dtos/CreateUser';
import { ResponseResult } from '../utils/Response';
import { Response } from 'express';
import { Hashing } from '../utils/Hashing';
import { ResponseBody } from '../types/Response';
import { UpdateUserDto } from 'src/dtos/UpdateUser';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

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
  ): Promise<Response<ResponseBody>> {
    try {
      const { email, name, password } = createUserDto;
      const passHash = await Hashing.generatePasswordHash(password);

      const user = await this.userModel.create({
        email,
        name,
        password: passHash,
      });

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.CREATED,
        'User created successfully.',
        { created: !!user },
      );
    } catch (error) {
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error,
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
  ): Promise<Response<ResponseBody>> {
    try {
      const { email, name } = updateUserDto;

      const user = await this.userModel.findOneAndUpdate(
        { $and: [{ _id: { $eq: userId } }] },
        { $set: { email, name } },
        { rawResult: true },
      );

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'User updated successfully.',
        {
          ...user.value,
          name: name ?? user.value.name,
          email: email ?? user.value.email,
          password: undefined,
        },
      );
    } catch (error) {
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error,
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
  ): Promise<Response<ResponseBody>> {
    try {
      const user = await this.userModel.findOne(options);

      if (!user) {
        return ResponseResult.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'User not found.',
          null,
        );
      }

      const { password, ...newUser } = user;

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'User found successfully.',
        newUser,
      );
    } catch (error) {
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error,
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
  ): Promise<Response<ResponseBody>> {
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
          affected: !!user,
        },
      );
    } catch (error) {
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error,
      );
    }
  }
}
