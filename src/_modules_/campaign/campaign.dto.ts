import { ApiProperty } from '@nestjs/swagger';
import { Campaign, FundCampaignStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { IsFloat, OptionalProperty } from 'decorators/validator.decorator';
import { BasePagingDto, BasePagingResponse } from 'utils/base.dto';

// TYPE //
export type ShortCampaign = Pick<
  Campaign,
  'id' | 'title' | 'goal' | 'endAt' | 'status'
>;

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
