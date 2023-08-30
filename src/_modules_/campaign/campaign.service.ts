import { Injectable } from '@nestjs/common';
import { PrismaService } from '_modules_/prisma/prisma.service';
import {
  CreateCampaignDto,
  FindCampaignDto,
  FindCampaignsResultDto
} from './campaign.dto';
import { Campaign } from '@prisma/client';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async find(
    findCampaignDto: FindCampaignDto
  ): Promise<FindCampaignsResultDto> {
    const { page, size } = findCampaignDto;
    const skip = (page - 1) * size;

    const [campaigns, count] = await Promise.all([
      this.prisma.campaign.findMany({
        take: size,
        skip: skip,
        include: {
          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      }),
      await this.prisma.campaign.count()
    ]);
    const result = campaigns.map(campaign => {
      return {
        ...campaign,
        categories: campaign.categories.map(category => category.category)
      };
    });
    return {
      data: result,
      page: page,
      size: size,
      totalPages: Math.ceil(count / size) || 0,
      totalElement: count
    };
  }

  async findOne(id: number): Promise<Campaign> {
    console.log(id);
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    const result = {
      ...campaign,
      categories: campaign.categories.map(category => category.category)
    };
    return result;
  }

  async create(creatorId: number, createCampaignDto: CreateCampaignDto) {
    const {
      title,
      description,
      localtion,
      startAt,
      endAt,
      goal,
      campaignTags,
      categoryIds
    } = createCampaignDto;
    try {
      await this.prisma.campaign.create({
        data: {
          title,
          description,
          localtion,
          startAt,
          endAt,
          goal,
          campaignTags,
          creatorId,
          categories: {
            create: categoryIds.map(id => ({ categoryId: id }))
          }
        }
      });
      return { message: 'success' };
    } catch (error) {
      return { message: 'fail!' };
    }
  }
}
