import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from '../db/schemas/User';
import { SigninDto } from '../dtos/Signin';
import { Hashing } from '../utils/Hashing';
import { ResponseResult } from '../utils/Response';
import { TokenService } from './Token';
import { Token } from '../db/schemas/Token';
import {
  ResponseBody,
  SignInResult,
  JwtPayload,
  AffectedResult,
} from '../types';
import { getImageRootPath } from '../utils/utils';

@Injectable()
export class AuthService {
  private logger: Logger;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    private readonly tokenService: TokenService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  /**
   * Sign in a user.
   *
   * @param {SigninDto} signinDto - the signin data
   * @param {Response} res - the response object
   * @return {Promise<any>} a promise that resolves to the response result
   */
  public async signin(
    signinDto: SigninDto,
    res: Response,
    req: Request,
  ): Promise<Response<ResponseBody<SignInResult>>> {
    try {
      const { email, password } = signinDto;
      const user = await this.userModel.findOne(
        {
          $and: [{ email: { $eq: email } }],
        },
        {},
        { populate: { path: 'image' } },
      );

      if (!user) {
        return ResponseResult.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'User not found.',
        );
      }

      const isMatch = await Hashing.checkPassword(password, user.password);

      if (!isMatch) {
        return ResponseResult.sendError(
          res,
          HttpStatus.UNAUTHORIZED,
          'Email or password is incorrect.',
        );
      }
      const { password: _, ...newUser } = user.toObject();
      const payload: JwtPayload = { id: user._id.toString(), email };

      const tokenPair = await this.tokenService.createTokenPair(payload);
      await this.tokenModel.create({ token: tokenPair.refreshToken });

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'User found successfully.',
        {
          user: {
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
          ...tokenPair,
        },
      );
    } catch (error) {
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error?.message ?? error,
      );
    }
  }

  /**
   * Performs a logout operation.
   *
   * @param {string} refreshToken - The refresh token used for authentication.
   * @param {Response} res - The response object used to send the result.
   * @return {Promise<Response<ResponseBody>>} A promise that resolves with the response object.
   */
  public async logout(
    refreshToken: string,
    res: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    try {
      const token = await this.tokenModel.findOneAndDelete({
        $and: [{ token: { $eq: refreshToken } }],
      });

      if (!token) {
        return ResponseResult.sendError(
          res,
          HttpStatus.BAD_REQUEST,
          'Wrong token.',
        );
      }

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'Logout successfully.',
        { isAffected: !!token },
      );
    } catch (error) {
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error?.message ?? error,
      );
    }
  }
}
