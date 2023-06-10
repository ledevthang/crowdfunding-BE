import { Category } from "src/category/entities/category.entity";
import { Transaction } from "src/transaction/entities/transaction.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column({ name: 'started_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ name: 'end_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  endAt: Date;

  @Column()
  goal: number;

  @Column()
  investor: number;

  @Column({name: "creator_id"})
  creatorId: number;

  @Column({name: "category_id"})
  categoryId: number;

  @ManyToOne(() => User, (user) => user.campaigns)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @ManyToOne(() => Category, (category) => category.campaigns)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Transaction, (transaction) => transaction.campaign)
  transactions: Transaction[];
}
