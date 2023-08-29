import { Controller, Get, Post, Query } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'decorators/user.decorator';
import { Auth } from 'decorators/auth.decorator';
import { FindCampaignDto } from './campaign.dto';

@Controller('campaigns')
@ApiTags('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  async find(@Query() findCampaignDto: FindCampaignDto) {
    return await this.campaignService.find(findCampaignDto);
  }

  @Post()
  @Auth('INVESTOR')
  createCampaign(@User('id') userId: number) {
    return userId;
  }
}
