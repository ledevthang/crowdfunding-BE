import { Campaign } from '../../campaign/entities/campaign.entity';
import { Role } from '../../role/entities/role.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import {
  Column,
  Entity,
  JoinColumn,
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

  @Column({name: "role_id", default: 2})
  roleId: number;

  @OneToMany(() => Campaign, (campaign) => campaign.creator)
  campaigns: Campaign[];

  @OneToMany(() => Transaction, (transaction) => transaction.creator)
  transactions: Transaction[];

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({name: 'role_id'})
  role: Role;
}
