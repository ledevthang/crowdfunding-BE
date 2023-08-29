import { Campaign } from "@prisma/client";
import { BasePagingDto, BasePagingResponse } from "utils/base.dto";

export class FindCampaignDto extends BasePagingDto {
}

export class FindCampaignsResultDto extends BasePagingResponse<Campaign> {
}