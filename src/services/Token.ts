import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPair } from '../types/TokenPair';
import { JwtPayload } from '../types/JwtPayload';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from '../db/schemas/Token';
import { Model } from 'mongoose';
import { ResponseResult } from '../utils/Response';
import { Response } from 'express';
import { ResponseBody } from '../types';

@Injectable()
export class TokenService {
  private logger: Logger;
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    private readonly jwtService: JwtService,
  ) {
    this.logger = new Logger(TokenService.name);
  }

  public async createTokenPair(payload: JwtPayload): Promise<TokenPair> {
    try {
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.TOKEN_EXPIRATION_TIME,
        secret: process.env.TOKEN_SECRET,
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.TOKEN_SECRET,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  public async getNewTokenPair(
    refreshToken: string,
    res: Response,
  ): Promise<Response<ResponseBody<TokenPair>>> {
    try {
      const token = await this.tokenModel.findOne({
        $and: [{ token: { $eq: refreshToken } }],
      });

      if (!token) {
        return ResponseResult.sendError(
          res,
          HttpStatus.BAD_REQUEST,
          'Invalid token.',
        );
      }
      const payload = await this.verifyToken(token.token);

      const tokenPair = await this.createTokenPair({
        id: payload.id,
        email: payload.email,
      });

      token.token = tokenPair.refreshToken;
      await token.save();

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'Token pair refreshed.',
        tokenPair,
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

  public async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.TOKEN_SECRET,
      });

      if (!payload) {
        throw new BadRequestException('Token is expired.');
      }

      return payload;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
