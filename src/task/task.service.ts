import { CampaignService } from './../campaign/campaign.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(
    private readonly campaignService: CampaignService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    const pagingDto = { page: 1, size : 10, query: '', order: 'asc' }
    const campaign = this.campaignService.find(pagingDto)
    console.log('handleCron')
  }
}
