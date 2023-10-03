import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { BullModule } from '@nestjs/bull';
import { Queues } from 'types/queue.type';

@Module({
  imports: [
    CampaignModule,
    BullModule.registerQueue({
      name: Queues.mail
    })
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService]
})
export class CampaignModule {}
