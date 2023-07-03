export class PaginationMeta {
  count: number;
  limit: number;
  page: number;
  totalPages: number;
}

export class ItemsPaginated<T> {
  items: T[];
  pagination: PaginationMeta;
}
