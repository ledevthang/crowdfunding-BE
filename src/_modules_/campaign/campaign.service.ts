import { Injectable } from '@nestjs/common';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { FindCampaignDto, FindCampaignsResultDto } from './campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async find(
    findCampaignDto: FindCampaignDto
  ): Promise<FindCampaignsResultDto> {
    const { page, size, order } = findCampaignDto;
    const findPage = page || 1;
    const findSize = size ? size : 10;
    const skip = findPage ? (findPage - 1) * findSize : 0;

    const [campaigns, count] = await Promise.all([
      this.prisma.campaign.findMany({
        take: findSize,
        skip: skip,
        orderBy: {
          id: order === 'desc' ? 'desc' : 'asc'
        }
      }),
      await this.prisma.campaign.count()
    ]);
    return {
      data: campaigns,
      page: findPage,
      size: findSize,
      totalPages: Math.ceil(count / findSize) || 0,
      totalElement: count
    };
  }
}
