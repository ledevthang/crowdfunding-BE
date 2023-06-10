import { Campaign } from "src/campaign/entities/campaign.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Campaign, campaign => campaign.category)
  campaigns: Campaign[];
}
