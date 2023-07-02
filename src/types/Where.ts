export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class Where {
  page?: number = 1;
  limit?: number = 10;
  sortOrder?: SortOrder = SortOrder.ASC;
  sortKey?: string = 'createdAt';
  search?: string;
}
