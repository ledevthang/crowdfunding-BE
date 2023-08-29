import { ApiProperty } from '@nestjs/swagger';

export class BasePagingResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElement: number;
}

export class BasePagingDto {
  @ApiProperty({
    description: 'Number of page'
  })
  readonly page: number = 1;
  @ApiProperty({
    description: 'Number of records per page'
  })
  readonly size: number = 10;
}
