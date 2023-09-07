import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
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
