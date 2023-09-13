import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import {
  MailJobs,
  Queues,
  TxnPendingPayload,
  TxnSucceedPayload
} from 'types/queue.type';
import { MailService } from './mail.service';

@Processor(Queues.mail)
export class MailConsumer {
  constructor(private emailService: MailService) {}

  @Process(MailJobs.TxnSucceed)
  async onTxnSucceed({ data }: Job<TxnSucceedPayload>) {
    this.emailService.sendMailOnTxnSucceed(data);
  }

  @Process(MailJobs.TxnPending)
  async onTxnPening({ data }: Job<TxnPendingPayload>) {
    this.emailService.sendMailOnTxnPending(data);
  }
}
