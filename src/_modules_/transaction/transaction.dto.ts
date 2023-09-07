import { ApiProperty } from '@nestjs/swagger';
import { Transaction, TransactionStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { IsFloat, OptionalProperty } from 'decorators/validator.decorator';
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

export class FindTransactionResultDto extends BasePagingResponse<Transaction> {}

export class FindTransactionDto extends BasePagingDto {
  @ApiProperty({ required: false })
  @Transform(param => Number(param.value) || null)
  campaignId: number;

  @ApiProperty({ required: false })
  @IsFloat
  @OptionalProperty()
  minAmount: number;

  @ApiProperty({ required: false })
  @IsFloat
  @OptionalProperty()
  maxAmount: number;

  @ApiProperty({ required: false })
  campaignTitle: string;

  @ApiProperty({ required: false })
  startDate: Date;

  @ApiProperty({ required: false })
  endDate: Date;

  @ApiProperty({
    type: 'string',
    required: false,
    description: 'Between 3 stauses: PENDING, PROCESSED, REFUNDED. Ex: PENDING,PROCESSED'
  })
  @Transform(param => param.value.split(','))
  states: TransactionStatus[];
}