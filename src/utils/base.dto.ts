export class BasePagingResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElement: number;
}

export class BasePagingDto {
  readonly page: number = 1;
  readonly size: number = 10;
}
