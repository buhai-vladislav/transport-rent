import { HttpStatus } from '@nestjs/common';
import { User } from '../db/schemas/User';
import { TokenPair } from './TokenPair';

export class RemoveResult {
  isAffected: boolean;
}

export class SignInResult extends TokenPair {
  user: User;
}

export class ResponseBody<T> {
  message: string;
  status: HttpStatus;
  data?: T;
  error?: any;
}
