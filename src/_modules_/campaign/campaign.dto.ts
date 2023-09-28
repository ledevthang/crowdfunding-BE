import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Campaign, FundCampaignStatus, UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { IsFloat, OptionalProperty } from 'decorators/validator.decorator';
import { BasePagingDto, BasePagingResponse, SortOrder } from 'utils/base.dto';

// TYPE //
export type ShortCampaign = Pick<
  Campaign,
  'id' | 'title' | 'goal' | 'endAt' | 'status'
>;

const sortField = {
  title: 'title',
  startAt: 'startAt',
  endAt: 'endAt',
  goal: 'goal',
  status: 'status',
  investors: 'investors',
  progress: 'progress'
} as const;

type sortField = (typeof sortField)[keyof typeof sortField];

const campaignStatus = {
  submitting: 'submitting',
  funding: 'funding'
} as const;

type campaignStatus = (typeof campaignStatus)[keyof typeof campaignStatus];

// END TYPE //

export class CreateCampaignDto {
  @ApiProperty({
    description: 'This is a required property'
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    description: 'This is a required property'
  })
  @IsNotEmpty()
  localtion: string;

  @ApiProperty({
    description: 'This is a required property'
  })
  @IsDateString()
  startAt: Date;

  @ApiProperty({
    description: 'This is a required property'
  })
  @IsDateString()
  endAt: Date;

  @ApiProperty({
    description: 'This is a required property'
  })
  @IsNumber()
  goal: number;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  backGroundUrl: string;

  @ApiProperty()
  campaignTags: string[];

  @ApiProperty()
  categoryIds: number[];

  @ApiProperty()
  bankId: number;
}

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  @ApiProperty({
    description: 'This is a required property'
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    enum: FundCampaignStatus,
    description: 'This is a required property'
  })
  @IsNotEmpty()
  @IsEnum(FundCampaignStatus)
  status: FundCampaignStatus;
}
export class FindCampaignDto extends BasePagingDto {
  @OptionalProperty({
    type: 'string',
    required: false,
    description: 'Sort field and order. ex: title,asc'
  })
  @Transform(param => param.value.split(','))
  sort?: string[] = ['id', 'asc'];

  @OptionalProperty({ description: 'Search query' })
  query?: string = '';

  @OptionalProperty()
  startDate?: Date;

  @OptionalProperty()
  endDate?: Date;

  @OptionalProperty({
    type: 'string',
    required: false,
    description: 'Category Ids. ex: 1,2,3'
  })
  @Transform(param => param.value.split(',').map(i => Number(i)))
  categoryIds?: number[];

  @OptionalProperty({
    type: 'string',
    required: false,
    description: 'Between 3 stauses: ON_GOING, FAILED, SUCCEED.'
  })
  @Transform(param => param.value.split(','))
  states?: FundCampaignStatus[];

  @OptionalProperty({
    enum: UserRole
  })
  @IsEnum(UserRole)
  userRole?: UserRole;

  @OptionalProperty()
  userId?: number;
}

export class FindCampaignsResultDto extends BasePagingResponse<Campaign> {}
export class FindFundedCampaignDto extends BasePagingDto {
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

  @OptionalProperty({
    type: 'string',
    required: false,
    description: 'Between 3 stauses: ON_GOING, FAILED, SUCCEED.'
  })
  @Transform(param => param.value.split(','))
  states?: FundCampaignStatus[];
}

export class FundedCampaignDto extends BasePagingResponse<ShortCampaign> {}

export class MyCampaignDto extends BasePagingDto {
  @OptionalProperty()
  campaignTitle?: string;

  @OptionalProperty({
    enum: FundCampaignStatus
  })
  @IsEnum(FundCampaignStatus)
  status?: FundCampaignStatus;

  @OptionalProperty()
  startDate?: Date;

  @OptionalProperty()
  endDate?: Date;

  @OptionalProperty({
    type: 'string',
    required: false
  })
  @IsEnum(sortField)
  sortField: sortField;

  @OptionalProperty({
    type: 'string',

    description: 'asc or desc'
  })
  @IsEnum(SortOrder)
  sortOrder: SortOrder;

  @OptionalProperty({
    enum: campaignStatus
  })
  @IsEnum(campaignStatus)
  campaignStatus?: campaignStatus;
}

export class DetailCampaignDto {
  @OptionalProperty()
  userId?: number;
}
