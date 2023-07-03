import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from '../db/schemas/Token';
import { TokenService } from '../services/Token';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    ConfigModule.forRoot(),
  ],
  providers: [TokenService, JwtService],
  exports: [TokenService],
})
export class TokenModule {}
