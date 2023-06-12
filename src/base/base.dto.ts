export class ResponsePaging<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export class PagingDto {
  readonly page: number;
  readonly size: number;
  readonly query: string;
  readonly order: string;
}

export class UserDto {
  id: number;
  email: string;
  roleId: number;
}