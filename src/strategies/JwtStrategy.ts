import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../types/JwtPayload';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../db/schemas/User';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_SECRET || 'SECRET',
    });
  }

  /**
   * Validates the given payload.
   *
   * @param {JwtPayload} payload - The payload to validate.
   * @return {Promise<object>} The validated user object.
   */
  async validate(payload: JwtPayload) {
    const { id } = payload;

    const userResult = await this.userModel.findOne({ $and: [{ _id: id }] });

    if (!userResult) {
      throw new UnauthorizedException();
    }

    const user = {
      id: userResult._id.toString(),
      email: userResult.email,
    };

    return user;
  }
}
