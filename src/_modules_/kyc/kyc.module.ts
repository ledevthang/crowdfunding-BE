import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { BullModule } from '@nestjs/bull';
import { Queues } from 'types/queue.type';
@Module({
  imports: [
    BullModule.registerQueue({
      name: Queues.mail
    })
  ],
  controllers: [KycController],
  providers: [KycService]
})
export class KycModule {}
