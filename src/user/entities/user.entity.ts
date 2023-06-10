import { Campaign } from 'src/campaign/entities/campaign.entity';
import { Role } from 'src/role/entities/role.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({name: "role_id"})
  roleId: number;

  @OneToMany(() => Campaign, (campaign) => campaign.creator)
  campaigns: Campaign[];

  @ManyToMany(() => Transaction, (transaction) => transaction.users)
  transactions: Transaction[];

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({name: 'role_id'})
  role: Role;
}
