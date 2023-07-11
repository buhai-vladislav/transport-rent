import { ITokenPair } from './Token';
import { IUser } from './User';

interface ISignInResponse extends ITokenPair {
  user: IUser;
}

interface ISignUp {
  email: string;
  password: string;
  name: string;
  imageId?: string;
}

interface ISignIn {
  email: string;
  password: string;
}

export type { ISignInResponse, ISignUp, ISignIn };
