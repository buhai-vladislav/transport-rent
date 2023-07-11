import { IBase } from './Base';

interface IImage extends IBase {
  name: string;
  encoding: string;
  mimetype: string;
  size: number;
  fileSrc: string;
}

export type { IImage };
