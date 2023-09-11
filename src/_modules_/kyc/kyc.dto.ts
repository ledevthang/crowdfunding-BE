import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BasePagingDto } from 'utils/base.dto';

const KycHandle = {
  APPROVE: 'APPROVE',
  REJECTE: 'REJECTE'
} as const;

type KycHandle = (typeof KycHandle)[keyof typeof KycHandle];

export class KycQuery extends BasePagingDto {}

export class KycUpdate {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: KycHandle })
  @IsEnum(KycHandle)
  action: KycHandle;
}

export class KycCreate {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty()
  @IsNotEmpty()
  streetAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  zip: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  stateProvince: string;

  @ApiProperty({ isArray: true })
  images: string[];
}
