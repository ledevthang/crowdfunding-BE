import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'decorators/user.decorator';
import { Auth } from 'decorators/auth.decorator';
import {
  BackersDto,
  CreateCampaignDto,
  DetailCampaignDto,
  FindCampaignDto,
  FindFundedCampaignDto,
  MyCampaignDto,
  UpdateCampaignDto
} from './campaign.dto';

@Controller('campaigns')
@ApiTags('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  async find(@Query() findCampaignDto: FindCampaignDto) {
    return await this.campaignService.find(findCampaignDto);
  }

  @Get('/funded-campaign')
  @Auth('INVESTOR')
  async findFundedCampaign(
    @User('id') userId: number,
    @Query() findCampaignDto: FindFundedCampaignDto
  ) {
    return await this.campaignService.findFundedCampaign(
      userId,
      findCampaignDto
    );
  }

  @Get('/my-campaign')
  @Auth('ADMINORFUNDRAISER')
  async findMyCampaign(
    @User('id') userId: number,
    @Query() query: MyCampaignDto
  ) {
    return await this.campaignService.findMyCampaign(userId, query);
  }

  @Get('/my-campaign/backers/:cId')
  @Auth('ADMINORFUNDRAISER')
  async findBackers(
    @User('id') creatorId: number,
    @Param('cId') cId: number,
    @Query() query: BackersDto
  ) {
    return this.campaignService.findBackers(+cId, creatorId, query);
  }

  @Post()
  @Auth('ADMINORFUNDRAISER')
  async createCampaign(
    @User('id') userId: number,
    @Body() createCampaignDto: CreateCampaignDto
  ) {
    return await this.campaignService.create(userId, createCampaignDto);
  }

  @Patch()
  @Auth('ADMIN')
  async updateCampaign(@Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignService.update(updateCampaignDto);
  }

  @Get('/:id')
  async findOne(
    @Param('id') id: string,
    @Query() { userId }: DetailCampaignDto
  ) {
    return await this.campaignService.findOne(+id, +userId);
  }

  @Delete('/:id')
  @Auth('ADMINORFUNDRAISER')
  async delete(@Param('id') id: string) {
    return await this.campaignService.delete(+id);
  }
}
