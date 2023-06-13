import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign]), TransactionModule],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService]
})
export class CampaignModule {}
