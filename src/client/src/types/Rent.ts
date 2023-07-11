import { IBase } from './Base';
import { ITransport, SortOrder } from './Transport';
import { IUser } from './User';

interface IRent extends IBase {
  user: IUser;
  transport: ITransport;
  fromDate: string;
  toDate: string;
  stoppedAt: string;
}

interface IRentBody {
  transportId: string;
  fromDate: Date;
  toDate: Date;
  stoppedAt?: Date;
}

interface IRentWhere {
  page?: number;
  limit?: number;
  sortOrder?: SortOrder;
  sortKey?: string;
}

export type { IRent, IRentBody, IRentWhere };
