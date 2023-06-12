import { paymentMethods, transactionStatus } from 'src/base/enum';
import { Campaign } from 'src/campaign/entities/campaign.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// enum transactionStatus {
//   PENDING = 'PENDING',
//   ACCEPTED = 'ACCEPTED',
//   REJECTED = 'REJECTED',
// }
@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ name: 'bank_name' })
  bankName: string;

  @Column({ name: 'bank_account_number'})
  bankAccountNumber: string;

  @Column({ name: 'banker_name' })
  bankerName: string;

  @Column({ name: 'banker_address' })
  bankerAddress: string;

  @Column({ name: 'banker_phone' })
  bankerPhone: string;

  @Column({ name: 'banker_zip_code' })
  bankerZipCode: string;

  @Column({ name: 'banker_email' })
  bankerEmail: string;

  @Column()
  note: string;

  @Column({
    type: 'enum',
    enum: transactionStatus,
    default: transactionStatus.PENDING,
  })
  status: transactionStatus;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: paymentMethods,
    default: paymentMethods.TRANSFER,
  })
  paymentMethod: paymentMethods;

  @Column({ name: 'campaign_id' })
  campaignId: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.transactions)
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @Column({ name: 'creator_id' })
  creatorId: number;

  @ManyToOne(() =>  User, (user) => user.transactions)
  @JoinColumn({name: 'creator_id'})
  creator: User;
}
