import { Campaign } from "src/campaign/entities/campaign.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({name: "bank_name"})
  bankName: string;

  @Column({name: "bank_account_number", unique: true})
  bankAccountNumber: string;

  @Column({name: "banker_name"})
  bankerName: string;

  @Column({name: "banker_address"})
  bankerAddress: string;

  @Column({name: "banker_phone"})
  bankerPhone: string;

  @Column({name: "banker_zip_code"})
  bankerZipCode: string;

  @Column({name: "banker_email"})
  bankerEmail: string;

  @Column()
  note: string;

  @Column()
  status: string;

  @Column({name: "campaign_id"})
  campaignId: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.transactions)
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @ManyToMany(() => User, (user) => user.transactions, {
    cascade: true,
  })
  @JoinTable()
  users: User[];
}
