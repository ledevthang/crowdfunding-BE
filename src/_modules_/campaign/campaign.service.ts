import { Injectable } from '@nestjs/common';
import { Campaign, CampaignFileType, Prisma } from '@prisma/client';
import { PrismaService } from '_modules_/prisma/prisma.service';
import {
  BackersDto,
  CreateCampaignDto,
  FindCampaignDto,
  FindCampaignsResultDto,
  FindFundedCampaignDto,
  FundedCampaignDto,
  MyCampaignDto,
  UpdateCampaignDto
} from './campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async find(
    findCampaignDto: FindCampaignDto
  ): Promise<FindCampaignsResultDto> {
    const {
      page,
      size,
      query,
      sort,
      startDate,
      endDate,
      categoryIds,
      states,
      userRole,
      userId
    } = findCampaignDto;
    const skip = (page - 1) * size;
    const [sortField, sortOrder] = sort;
    let campaignCondition: Prisma.CampaignWhereInput = {
      categories: {},
      status: {
        notIn: ['PENDING', 'REJECTED']
      }
    };

    const titleCondition: Prisma.StringFilter = {};
    let campaignOrderBy: Prisma.CampaignOrderByWithRelationInput = {};

    if (userId && userRole === 'FUNDRASIER') {
      campaignCondition = {
        creatorId: Number(userId)
      };
    }

    if (userRole === 'ADMIN') campaignCondition = {};

    if (query) {
      titleCondition.contains = query;
      titleCondition.mode = 'insensitive';
    }
    if (categoryIds) {
      campaignCondition.categories.some = {
        categoryId: {
          in: categoryIds
        }
      };
    }

    if (startDate && endDate) {
      campaignCondition.endAt = {
        gte: startDate,
        lte: endDate
      };
    }

    if (states) {
      campaignCondition.status = {
        in: states
      };
    }

    if (sortField && sortOrder) {
      if (sortField === 'investor') {
        campaignOrderBy.transactions = {
          _count: 'desc'
        };
      } else {
        campaignOrderBy = {
          [sortField]: sortOrder
        };
      }
    }

    campaignCondition.title = titleCondition;

    const [campaigns, count] = await Promise.all([
      this.prisma.campaign.findMany({
        take: size,
        skip: skip,
        where: campaignCondition,
        orderBy: campaignOrderBy,
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
          },
          transactions: {
            select: {
              userId: true
            },
            where: {
              completed: true,
              status: 'PROCESSED'
            },
            distinct: ['userId']
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
          )?.url || '',
        investors: campaign.transactions.length
      };
      delete newCampaign.campaignFiles;
      delete newCampaign.transactions;
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

  async findOne(id: number, userId?: number): Promise<Campaign> {
    const [campaign, averageDonation] = await Promise.all([
      this.prisma.campaign.findUnique({
        where: { id },
        include: {
          categories: {
            select: {
              category: {
                select: {
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
          },
          transactions: {
            select: {
              userId: true
            },
            where: {
              completed: true,
              status: 'PROCESSED'
            },
            distinct: ['userId']
          }
        }
      }),
      this.prisma.transaction.aggregate({
        where: {
          campaignId: id
        },
        _avg: {
          amount: true
        }
      })
    ]);

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
        )?.url || '',
      investors: campaign.transactions.length,
      averageDonation: averageDonation._avg.amount,
      isOwner: userId === campaign.creatorId
    };
    delete result.campaignFiles;
    delete result.transactions;
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
          completed: true,
          status: 'PROCESSED'
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
          status: true,
          transactions: {
            select: {
              amount: true,
              fundAt: true
            },
            where: {
              userId,
              status: 'PROCESSED',
              completed: true
            },
            orderBy: {
              fundAt: 'desc'
            }
          }
        },
        where: campaignCondition
      }),
      await this.prisma.campaign.count({
        where: campaignCondition
      })
    ]);

    const result = campaigns.map(c => {
      const { endAt, goal, id, status, title, transactions } = c;
      const fundedAmount = transactions.reduce(
        (prev, cur) => prev + cur.amount,
        0
      );
      const paymentDate = transactions[0].fundAt;
      return {
        endAt,
        goal,
        id,
        status,
        title,
        fundedAmount,
        paymentDate
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

  async findMyCampaign(userId: number, query: MyCampaignDto) {
    const {
      page,
      size,
      sortField,
      sortOrder,
      campaignTitle,
      status,
      startDate,
      endDate,
      campaignStatus
    } = query;

    const campaignCondition: Prisma.CampaignWhereInput = {
      creatorId: userId
    };

    let campaignSortCondition: Prisma.CampaignOrderByWithRelationInput = {
      transactions: {
        _count: 'asc'
      }
    };

    if (campaignTitle)
      campaignCondition.title = {
        contains: campaignTitle,
        mode: 'insensitive'
      };

    if (status)
      campaignCondition.status = {
        equals: status
      };

    if (startDate && endDate)
      campaignCondition.AND = {
        startAt: {
          lte: endDate
        },
        endAt: {
          gte: startDate
        }
      };

    if (campaignStatus === 'submitting')
      campaignCondition.NOT = {
        status: {
          in: ['FAILED', 'SUCCEED']
        }
      };

    if (campaignStatus === 'funding')
      campaignCondition.status = {
        notIn: ['PENDING', 'REJECTED']
      };

    if (sortField && sortOrder) {
      if (sortField === 'investors') {
        campaignSortCondition.transactions = {
          _count: sortOrder
        };
      } else {
        campaignSortCondition = {
          [sortField]: sortOrder
        };
      }
    }

    const [campaigns, count, totalRaised, totalSuceed] = await Promise.all([
      this.prisma.campaign.findMany({
        where: campaignCondition,
        orderBy: campaignSortCondition,
        include: {
          transactions: {
            where: {
              completed: true,
              status: 'PROCESSED'
            },
            distinct: ['userId']
          }
        },
        take: size,
        skip: (page - 1) * size
      }),
      this.prisma.campaign.count({
        where: campaignCondition
      }),
      this.prisma.campaign.aggregate({
        where: {
          creatorId: userId
        },
        _sum: {
          currentAmount: true
        }
      }),
      this.prisma.campaign.aggregate({
        where: {
          creatorId: userId,
          status: 'SUCCEED'
        },
        _sum: {
          currentAmount: true
        }
      })
    ]);

    const result = campaigns.map(campaign => {
      const newCampaign = {
        ...campaign,
        investors: campaign.transactions.length
      };
      return newCampaign;
    });

    return {
      data: result,
      page: page,
      size: size,
      totalPages: Math.ceil(count / size) || 0,
      totalElement: count,
      totalGoal: totalRaised._sum.currentAmount,
      totalSuceed: totalSuceed._sum.currentAmount
    };
  }

  async findBackers(cId: number, creatorId: number, query: BackersDto) {
    const { page, size, sortField, sortOrder } = query;

    const backerConditions: Prisma.TransactionWhereInput = {
      campaignId: cId,
      status: 'PROCESSED',
      campaign: {
        creatorId: creatorId
      }
    };

    let backersOrderby: Prisma.TransactionOrderByWithRelationInput = {
      user: {}
    };

    if (sortField === 'name' && sortOrder)
      backersOrderby.user = {
        displayName: sortOrder
      };

    if (sortField === 'email' && sortOrder)
      backersOrderby.user = {
        email: sortOrder
      };

    if (
      (sortField === 'amount' ||
        sortField === 'fundAt' ||
        sortField === 'generatedNote') &&
      sortOrder
    )
      backersOrderby = {
        [sortField]: sortOrder
      };

    const [backers, totalElement, aggregate, totalInvestor] = await Promise.all(
      [
        this.prisma.transaction.findMany({
          where: backerConditions,
          take: size,
          skip: (page - 1) * size,
          select: {
            amount: true,
            fundAt: true,
            generatedNote: true,
            user: {
              select: {
                email: true,
                displayName: true
              }
            }
          },
          orderBy: backersOrderby
        }),
        this.prisma.transaction.count({
          where: backerConditions
        }),
        this.prisma.transaction.aggregate({
          where: backerConditions,
          _sum: {
            amount: true
          },
          _avg: {
            amount: true
          }
        }),
        this.prisma.transaction.findMany({
          where: backerConditions,
          distinct: ['userId']
        })
      ]
    );

    const result = backers.map(({ amount, fundAt, generatedNote, user }) => ({
      fundName: user.displayName,
      fundEmail: user.email,
      fundAt,
      generatedNote,
      amount
    }));

    return {
      data: result,
      page: page,
      size: size,
      totalPages: Math.ceil(totalElement / size) || 0,
      totalElement: totalElement,
      totalAmount: aggregate._sum.amount,
      averageAmount: aggregate._avg.amount,
      totalInvestor: totalInvestor.length
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
      backGroundUrl,
      bankId
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
          },
          campaignBankId: bankId
        }
      });
      return { message: 'success' };
    } catch (error) {
      return { message: 'fail!' };
    }
  }

  async update(updateCampaignDto: UpdateCampaignDto) {
    const { id, status } = updateCampaignDto;

    return await this.prisma.campaign.update({
      where: {
        id
      },
      data: {
        status
      }
    });
  }

  async delete(id: number) {
    try {
      await this.prisma.campaign.delete({ where: { id } });
      return { message: 'success' };
    } catch (error) {
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
