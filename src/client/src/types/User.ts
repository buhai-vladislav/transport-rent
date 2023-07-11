import { IBase } from './Base';
import { IImage } from './Image';

interface IUser extends IBase {
  name: string;
  email: string;
  role: string;
  image?: IImage;
}

export type { IUser };
