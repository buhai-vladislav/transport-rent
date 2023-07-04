import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../db/schemas/User';
import { UserService } from '../services/User';
import { UserController } from '../controllers/User';
import { File, FileSchema } from '../db/schemas/File';
import { MinioClientModule } from './Minio';

@Module({
  imports: [
    MinioClientModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: File.name, schema: FileSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
