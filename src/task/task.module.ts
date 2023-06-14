import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { CampaignModule } from '../../src/campaign/campaign.module';

@Module({
  imports: [CampaignModule],
  providers: [TaskService]
})
export class TaskModule {}
