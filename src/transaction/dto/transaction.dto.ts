import { PagingDto } from "../../base/base.dto";
import { transactionStatus } from "../../base/enum";

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

export class UpdateTransactionDto {
}

export class TransactionPagingDto extends PagingDto {
  status: string;
}