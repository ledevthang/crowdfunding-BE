import { Injectable } from '@nestjs/common';
import { PrismaService } from '_modules_/prisma/prisma.service';
import {
  CreateCampaignDto,
  FindCampaignDto,
  FindCampaignsResultDto
} from './campaign.dto';
import { Campaign, CampaignFileType } from '@prisma/client';
import { FileService } from '_modules_/file/file.service';

@Injectable()
export class CampaignService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService
  ) {}

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
          },
          campaignFiles: {
            select: {
              url: true,
              type: true
            }
          }
        }
      }),
      await this.prisma.campaign.count()
    ]);
    const result = campaigns.map(campaign => {
      const newCampaign = {
        ...campaign,
        categories: campaign.categories.map(category => category.category),
        imageUrl: campaign.campaignFiles.find(
          item => item.type === CampaignFileType.IMAGE
        )?.url || "",
        backgroundUrl: campaign.campaignFiles.find(
          item => item.type === CampaignFileType.BACKGROUND
        )?.url || ""
      }
      delete newCampaign.campaignFiles
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
      imageUrl: campaign.campaignFiles.find(
        item => item.type === CampaignFileType.IMAGE
      )?.url || "",
      backgroundUrl: campaign.campaignFiles.find(
        item => item.type === CampaignFileType.BACKGROUND
      )?.url || ""
    };
    delete result.campaignFiles
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
}
