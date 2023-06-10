import { Campaign } from "src/campaign/entities/campaign.entity";
import { Transaction } from "src/transaction/entities/transaction.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Campaign, (campaign) => campaign.creator)
  campaigns: Campaign[];

  @ManyToMany(() => Transaction, transaction => transaction.users)
  transactions: Transaction[];
}
