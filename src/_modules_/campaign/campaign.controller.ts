import { Controller, Post } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'decorators/user.decorator';
import { Auth } from 'decorators/auth.decorator';

@Controller('campaigns')
@ApiTags('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @Auth('INVESTOR')
  createCampaign(@User('id') userId: number) {
    return userId;
  }
}
