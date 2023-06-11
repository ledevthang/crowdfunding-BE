import { Campaign } from "../entities/campaign.entity";

export class CreateCampaignDto {
  title: string;
  description: string;
  location: string;
  endAt: string;
  goal: number;
  imageUrl: string;
  categoryId: number;
}

export class CampaignDto extends Campaign {
  investedAmount: number;
  progress: number;
}

export class UpdateCampaignDto {
  title: string;
  description: string;
  location: string;
  endAt: string;
  goal: number;
  imageUrl: string;
  categoryId: number;
}