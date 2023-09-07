import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'decorators/user.decorator';
import { Auth } from 'decorators/auth.decorator';
import { CreateCampaignDto, FindCampaignDto } from './campaign.dto';

@Controller('campaigns')
@ApiTags('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  async find(@Query() findCampaignDto: FindCampaignDto) {
    return await this.campaignService.find(findCampaignDto);
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
}
