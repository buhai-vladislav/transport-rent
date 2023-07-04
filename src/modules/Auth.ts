import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from '../db/schemas/Token';
import { User, UserSchema } from '../db/schemas/User';
import { AuthService } from '../services/Auth';
import { TokenModule } from './Token';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../controllers/Auth';
import { UserService } from '../services/User';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../strategies/JwtStrategy';
import { File, FileSchema } from '../db/schemas/File';
import { MinioClientModule } from './Minio';

@Module({
  imports: [
    TokenModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: File.name, schema: FileSchema },
    ]),
    ConfigModule.forRoot(),
    PassportModule.register({
      defaultStrategy: ['jwt'],
      property: 'user',
    }),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET || 'SECRET',
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRATION_TIME || '24h',
      },
    }),
    MinioClientModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
