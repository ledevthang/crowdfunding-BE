export class BasePagingResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElement: number;
}

export class BasePagingDto {
  readonly page: number;
  readonly size: number;
  readonly query: string;
  readonly order: string;
}