import { transactionStatus } from "src/base/enum";

export class CreateTransactionDto {
  amount: number;
  bankName: string;
  bankAccountNumber: string;
  bankerName: string;
  bankerAddress: string;
  bankerPhone: string;
  bankerZipCode: string;
  bankerEmail: string;
  note: string;
  campaignId: number;
}

export class ChangeTransactionStatusDto {
  status: transactionStatus;
}
