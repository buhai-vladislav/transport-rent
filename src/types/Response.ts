import { HttpStatus } from '@nestjs/common';
import { TokenPair } from './TokenPair';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './User';

export class RemoveResult {
  isAffected: boolean;
}

export class SignInResult extends TokenPair {
  @ApiProperty({ type: User })
  user: User;
}

export class ResponseBody<T> {
  @ApiProperty({ example: 'Message example.' })
  message: string;
  @ApiProperty({ example: 200 })
  statusCode: HttpStatus;
  data?: T;
  error?: any;
}
