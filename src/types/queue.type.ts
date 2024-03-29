export const Queues = {
  mail: 'mail'
} as const;

export const MailJobs = {
  TxnSucceed: 'TxnSucceed',
  TxnPending: 'TxnPending',
  KycPending: 'KycPending',
  KycApproved: 'KycApproved',
  KycRejected: 'KycRejected',
  CampaignPending: 'CampaignPending',
  CampaignApproved: 'CampaignApproved',
  CampaignRejected: 'CampaignRejected'
} as const;

export type TxnSucceedPayload = {
  email: string;
  amout: number;
  receivingAccount: string;
  additionInfor: string;
  displayname: string;
  accountHoldername: string;
  campaignTitle: string;
};

export type TxnPendingPayload = TxnSucceedPayload;

export type TxnQueuePayload = TxnPendingPayload | TxnSucceedPayload;

export type KycPayload = {
  displayname: string;
  email: string;
};
export type KycQueuePayload = KycPayload;

export type CampaignQueuePayload = {
  userName: string;
  email: string;
  campaignName: string;
};
