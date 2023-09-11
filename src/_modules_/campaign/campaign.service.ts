import { Injectable } from '@nestjs/common';
import { PrismaService } from '_modules_/prisma/prisma.service';
import {
  CreateCampaignDto,
  FindCampaignDto,
  FindCampaignsResultDto,
  FindFundedCampaignDto,
  FundedCampaignDto
} from './campaign.dto';
import { Campaign, CampaignFileType, Prisma } from '@prisma/client';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async find(
    findCampaignDto: FindCampaignDto
  ): Promise<FindCampaignsResultDto> {
    const { page, size, query, sort, startDate, endDate, categoryIds, states } =
      findCampaignDto;
    const skip = (page - 1) * size;
    const [sortField, sortOrder] = sort;
    const campaignCondition: Prisma.CampaignWhereInput = { categories: {} };

    if (query) {
      campaignCondition.title = {
        contains: query,
        mode: 'insensitive'
      };
    }
    if (categoryIds) {
      campaignCondition.categories.some = {
        categoryId: {
          in: categoryIds
        }
      };
    }

    const dateCondition: Prisma.DateTimeFilter<'Campaign'> = {};

    if (startDate) {
      dateCondition.gte = startDate;
    }

    if (endDate) {
      dateCondition.lte = endDate;
    }

    if (states) {
      campaignCondition.status = {
        in: states
      };
    }

    campaignCondition.endAt = dateCondition;
    const [campaigns, count] = await Promise.all([
      this.prisma.campaign.findMany({
        take: size,
        skip: skip,
        where: campaignCondition,
        orderBy: {
          [sortField]: sortOrder
        },
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
          },
          campaignFiles: {
            select: {
              url: true,
              type: true
            }
          }
        }
      }),
      await this.prisma.campaign.count({ where: campaignCondition })
    ]);
    const result = campaigns.map(campaign => {
      const newCampaign = {
        ...campaign,
        categories: campaign.categories.map(category => category.category),
        imageUrl:
          campaign.campaignFiles.find(
            item => item.type === CampaignFileType.IMAGE
          )?.url || '',
        backgroundUrl:
          campaign.campaignFiles.find(
            item => item.type === CampaignFileType.BACKGROUND
          )?.url || ''
      };
      delete newCampaign.campaignFiles;
      return newCampaign;
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
        },
        campaignFiles: {
          select: {
            url: true,
            type: true
          }
        }
      }
    });
    const result = {
      ...campaign,
      categories: campaign.categories.map(category => category.category),
      imageUrl:
        campaign.campaignFiles.find(
          item => item.type === CampaignFileType.IMAGE
        )?.url || '',
      backgroundUrl:
        campaign.campaignFiles.find(
          item => item.type === CampaignFileType.BACKGROUND
        )?.url || ''
    };
    delete result.campaignFiles;
    return result;
  }

  async findFundedCampaign(
    userId: number,
    findFundedCampaignDto: FindFundedCampaignDto
  ): Promise<FundedCampaignDto> {
    const {
      page,
      size,
      minAmount,
      maxAmount,
      campaignTitle,
      startDate,
      endDate,
      states
    } = findFundedCampaignDto;

    const campaignCondition: Prisma.CampaignWhereInput = {
      transactions: {
        some: {
          userId,
          completed: true
        }
      }
    };

    if (maxAmount || minAmount) {
      const ids = await this.findCampaignsByAmountFunded(
        userId,
        minAmount,
        maxAmount
      );

      campaignCondition.id = {
        in: ids
      };
    }

    if (campaignTitle) {
      campaignCondition.title = {
        contains: campaignTitle,
        mode: 'insensitive'
      };
    }

    const dateCondition: Prisma.DateTimeFilter<'Campaign'> = {};

    if (startDate) {
      dateCondition.gte = startDate;
    }

    if (endDate) {
      dateCondition.lte = endDate;
    }

    if (states) {
      campaignCondition.status = {
        in: states
      };
    }

    campaignCondition.endAt = dateCondition;

    const skip = (page - 1) * size;
    const [campaigns, count] = await Promise.all([
      await this.prisma.campaign.findMany({
        take: size,
        skip: skip,
        select: {
          id: true,
          title: true,
          goal: true,
          endAt: true,
          status: true
        },
        where: campaignCondition
      }),
      await this.prisma.campaign.count({
        where: campaignCondition
      })
    ]);
    return {
      data: campaigns,
      page: page,
      size: size,
      totalPages: Math.ceil(count / size) || 0,
      totalElement: count
    };
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
      categoryIds,
      imageUrl,
      backGroundUrl
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
          },
          campaignFiles: {
            create: [
              {
                url: imageUrl,
                type: CampaignFileType.IMAGE
              },
              {
                url: backGroundUrl,
                type: CampaignFileType.BACKGROUND
              }
            ]
          }
        }
      });
      return { message: 'success' };
    } catch (error) {
      return { message: 'fail!' };
    }
  }

  async delete(id: number) {
    try {
      await Promise.all([
        this.prisma.transaction.deleteMany({
          where: {
            campaignId: id
          }
        }),
        this.prisma.campaignBank.deleteMany({
          where: {
            campaignId: id
          }
        }),
        this.prisma.campaignFile.deleteMany({
          where: {
            campaignId: id
          }
        }),
        this.prisma.categoryCampaign.deleteMany({
          where: {
            campaignId: id
          }
        })
      ]);
      await this.prisma.campaign.delete({ where: { id } });
      return { message: 'success' };
    } catch (error) {
      console.log(error);
      return {
        message:
          error.code === 'P2025' ? 'Record to delete does not exist.' : 'fail!'
      };
    }
  }

  private async findCampaignsByAmountFunded(
    userId: number,
    min?: number,
    max?: number
  ) {
    const txns = await this.prisma.transaction.groupBy({
      by: ['campaignId'],
      where: {
        status: 'PROCESSED',
        userId,
        completed: true
      },
      having: {
        amount: {
          _sum: {
            gt: min,
            lt: max
          }
        }
      }
    });
    return txns.map(t => t.campaignId);
  }
}
