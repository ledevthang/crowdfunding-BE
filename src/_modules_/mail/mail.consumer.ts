import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import {
  CampaignQueuePayload,
  KycQueuePayload,
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

  @Process(MailJobs.KycPending)
  async onKycPening({ data }: Job<KycQueuePayload>) {
    this.emailService.sendMailOnKycPending(data);
  }

  @Process(MailJobs.KycApproved)
  async onKycApproved({ data }: Job<KycQueuePayload>) {
    this.emailService.sendMailOnKycApproved(data);
  }

  @Process(MailJobs.KycRejected)
  async onKycRejected({ data }: Job<KycQueuePayload>) {
    this.emailService.sendMailOnKycRejected(data);
  }

  @Process(MailJobs.CampaignPending)
  async onCpnPending({ data }: Job<CampaignQueuePayload>) {
    this.emailService.sendMailOnCpnPending(data);
  }

  @Process(MailJobs.CampaignApproved)
  async onCpnApproved({ data }: Job<CampaignQueuePayload>) {
    this.emailService.sendMailOnCpnApproved(data);
  }

  @Process(MailJobs.CampaignRejected)
  async onCpnRejected({ data }: Job<CampaignQueuePayload>) {
    this.emailService.sendMailOnCpnRejected(data);
  }
}
