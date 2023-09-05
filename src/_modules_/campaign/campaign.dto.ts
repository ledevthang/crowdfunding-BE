import { ApiProperty } from '@nestjs/swagger';
import { Campaign } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { BasePagingDto, BasePagingResponse } from 'utils/base.dto';

export class FindCampaignDto extends BasePagingDto {
  @ApiProperty({
    type: 'string',
    required: false,
    description: 'Sort field and order. ex: title,asc'
  })
  @Transform(param => param.value.split(','))
  sort: string[] = ['id', 'asc'];

  @ApiProperty({ required: false, description: 'Search query' })
  query: string = '';

  @ApiProperty({
    type: 'string',
    required: false,
    description: 'Category Ids. ex: 1,2,3'
  })
  @Transform(param => param.value.split(',').map(i => Number(i)))
  categoryIds: number[];
}

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

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  backGroundUrl: string;

  @ApiProperty()
  campaignTags: string[];

  @ApiProperty()
  categoryIds: number[];
}
