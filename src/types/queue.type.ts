export const Queues = {
  mail: 'mail',
  campaign: 'campaign',
} as const;

export const MailJobs = {
  TxnSucceed: 'TxnSucceed',
  TxnPending: 'TxnPending'
} as const;

export type TxnSucceedPayload = {
  email: string;
  amout: number;
  receivingAccount: string;
  additionInfor: string;
  displayname: string;
  accountHoldername: string;
};

export type TxnPendingPayload = TxnSucceedPayload;

export type TxnQueuePayload = TxnPendingPayload | TxnSucceedPayload;
