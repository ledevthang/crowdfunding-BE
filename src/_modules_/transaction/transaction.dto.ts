import { ApiProperty } from '@nestjs/swagger';
import { Transaction, TransactionStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';
import { IsFloat, IsInterger, OptionalProperty } from 'decorators/validator.decorator';
import { BasePagingDto, BasePagingResponse } from 'utils/base.dto';

export class CreateTransactionDto {
  @IsInt()
  @ApiProperty({
    description: 'This is a required property'
  })
  amount: number;

  @IsInt()
  @ApiProperty({
    description: 'This is a required property'
  })
  campaignId: number;
}

export class UpdateTransactionDto {
  @ApiProperty()
  @IsInterger
  id: number;

  @ApiProperty({ enum: TransactionStatus })
  @IsEnum(TransactionStatus)
  action: TransactionStatus;
}

export class FindTransactionDto extends BasePagingDto {
  @OptionalProperty()
  @Transform(param => Number(param.value) || null)
  campaignId?: number;

  @OptionalProperty({
    type: 'string'
  })
  @Transform(param => param.value.split(','))
  sort?: string[] = ['id', 'asc'];

  @IsFloat
  @OptionalProperty()
  minAmount?: number;

  @IsFloat
  @OptionalProperty()
  maxAmount?: number;

  @OptionalProperty()
  campaignTitle?: string;

  @OptionalProperty()
  startDate?: Date;

  @OptionalProperty()
  endDate?: Date;

  @Transform(param => param.value.split(','))
  @OptionalProperty({
    type: 'string',
    required: false,
    description:
      'Between 3 stauses: PENDING, PROCESSED, REFUNDED. Ex: PENDING,PROCESSED'
  })
  states?: TransactionStatus[];
}

export class FindTransactionResultDto extends BasePagingResponse<Transaction> {}
