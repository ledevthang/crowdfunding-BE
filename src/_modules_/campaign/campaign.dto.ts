import { ApiProperty } from '@nestjs/swagger';
import { Campaign } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { BasePagingDto, BasePagingResponse } from 'utils/base.dto';

export class FindCampaignDto extends BasePagingDto {}

export class FindCampaignsResultDto extends BasePagingResponse<Campaign> {}

export class CreateCampaignDto {
  @ApiProperty({
    description: 'This is a required property'
  })
  @IsNotEmpty()
  title: string;

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

  @ApiProperty({})
  imageUrl: string;

  @ApiProperty({})
  backGroundUrl: string;

  campaignTags: string[];

  categoryIds: number[];
}
