import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './User';
import { TokenModule } from './Token';
import { TransportModule } from './Transport';
import { FileModule } from './File';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_INITDB_USERNAME}:${process.env.MONGO_INITDB_PASSWORD}@${process.env.MONGO_INITDB_HOST}:${process.env.MONGO_INITDB_PORT}`,
    ),
    UserModule,
    TokenModule,
    TransportModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class ApplicationModule {}
