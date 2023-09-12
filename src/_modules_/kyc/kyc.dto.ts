import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OptionalProperty } from 'decorators/validator.decorator';
import { BasePagingDto } from 'utils/base.dto';

const KycHandle = {
  APPROVE: 'APPROVE',
  REJECT: 'REJECT'
} as const;

const KycStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTE: 'REJECTED'
} as const;

const SortField = {
  RISK: 'risk',
  STATUS: 'status',
  DATE: 'submittedAt',
  NAME: 'displayName'
} as const;

const SortOrder = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

type KycHandle = (typeof KycHandle)[keyof typeof KycHandle];
type KycStatus = (typeof KycStatus)[keyof typeof KycStatus];
type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
type SortField = (typeof SortField)[keyof typeof SortField];

export class KycQuery extends BasePagingDto {
  @OptionalProperty()
  keywords?: string;

  @OptionalProperty({
    type: 'string',
    required: false,
    description: 'Between 3 stauses: PENDING, APPROVED, REJECTED'
  })
  @IsEnum(KycStatus)
  status: KycStatus;

  @OptionalProperty({
    type: 'string',
    required: false,
    description: 'Between 3 stauses: risk, status, submittedAt'
  })
  @IsEnum(SortField)
  sortField: SortField;

  @OptionalProperty({
    type: 'string',
    required: false,
    description: 'asc or desc'
  })
  @IsEnum(SortOrder)
  sortOrder: SortOrder;

  @OptionalProperty()
  startDate?: Date;

  @OptionalProperty()
  endDate?: Date;
}

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
