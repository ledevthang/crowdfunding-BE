import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { BullModule } from '@nestjs/bull';
import { Queues } from 'types/queue.type';
import { CampaignModule } from '_modules_/campaign/campaign.module';

@Module({
  imports: [
    CampaignModule,
    BullModule.registerQueue({
      name: Queues.mail
    })
  ],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
