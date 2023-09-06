import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'This is a required property'
  })
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'This is a required property'
  })
  campaignId: number;
}
