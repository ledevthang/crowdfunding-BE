import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'decorators/user.decorator';
import { Auth } from 'decorators/auth.decorator';
import {
  CreateCampaignDto,
  FindCampaignDto,
  FindFundedCampaignDto
} from './campaign.dto';

@Controller('campaigns')
@ApiTags('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  async find(@Query() findCampaignDto: FindCampaignDto) {
    return await this.campaignService.find(findCampaignDto);
  }

  @Get('/self')
  @Auth('INVESTOR')
  async findSelf(
    @User('id') userId: number,
    @Query() findCampaignDto: FindFundedCampaignDto
  ) {
    return await this.campaignService.findFundedCampaign(
      userId,
      findCampaignDto
    );
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.campaignService.findOne(+id);
  }

  @Post()
  @Auth('INVESTOR')
  async createCampaign(
    @User('id') userId: number,
    @Body() createCampaignDto: CreateCampaignDto
  ) {
    return await this.campaignService.create(userId, createCampaignDto);
  }

  @Delete('/:id')
  @Auth('ADMIN')
  async delete(@Param('id') id: string) {
    return await this.campaignService.delete(+id);
  }
}
