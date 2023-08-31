import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { FileModule } from '_modules_/file/file.module';

@Module({
  imports: [FileModule],
  controllers: [CampaignController],
  providers: [CampaignService]
})
export class CampaignModule {}
