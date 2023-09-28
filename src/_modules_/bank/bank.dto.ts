import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BasePagingDto } from 'utils/base.dto';

export class FindBankDto extends BasePagingDto {}

export class CreateBankDto {
  @ApiProperty({
    description: 'This is a required property'
  })
  @IsNotEmpty()
  accountHolderName: string;

  @ApiProperty()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({
    description: 'This is a required property'
  })
  @IsNotEmpty()
  bankNumber: string;
}
