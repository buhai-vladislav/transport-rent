import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/db/schemas/User';
import { SigninDto } from 'src/dtos/Signin';
import { JwtPayload } from 'src/types/JwtPayload';
import { Hashing } from 'src/utils/Hashing';
import { ResponseResult } from 'src/utils/Response';
import { TokenService } from './Token';
import { Token } from 'src/db/schemas/Token';
import { ResponseBody } from 'src/types/Response';

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
  public async signin(signinDto: SigninDto, res: Response) {
    try {
      const { email, password } = signinDto;
      const user = await this.userModel.findOne({
        $and: [{ email: { $eq: email } }],
      });

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
          HttpStatus.BAD_REQUEST,
          'Email or password is incorrect.',
        );
      }
      const { password: _, ...newUser } = user;
      const payload: JwtPayload = { id: user.id, email };

      const tokenPair = await this.tokenService.createTokenPair(payload);
      await this.tokenModel.create({ token: tokenPair.refreshToken });

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'User found successfully.',
        { user: newUser, ...tokenPair },
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
   * Performs a logout operation.
   *
   * @param {string} refreshToken - The refresh token used for authentication.
   * @param {Response} res - The response object used to send the result.
   * @return {Promise<Response<ResponseBody>>} A promise that resolves with the response object.
   */
  public async logout(
    refreshToken: string,
    res: Response,
  ): Promise<Response<ResponseBody>> {
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
        null,
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
