import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './entities/campaign.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingDto, ResponsePaging } from 'src/base/base.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}
  async create(
    creatorId: number,
    createCampaignDto: CreateCampaignDto,
  ): Promise<Boolean> {
    const { title, description, location, endAt, goal, categoryId } =
      createCampaignDto;
    try {
      const startedAt = new Date();
      const endAtTime = new Date(endAt);
      const investor = 0;
      const campaign = {
        title,
        description,
        location,
        startedAt,
        endAt: endAtTime,
        investor,
        goal,
        creatorId,
        categoryId,
      };
      await this.campaignRepository.save(campaign);
      return true;
    } catch (error) {}
  }

  async find(pagingDto: PagingDto) : Promise<ResponsePaging<Campaign>> {
    try {
      const { page, size, query, order } = pagingDto;
      const findSize = size ? size : 10;
      const skip = page ? page * size : 0;
      const findParams: FindManyOptions<Campaign> = {
        take: findSize,
        skip: skip,
        order: {
          id: order === 'desc' ? 'DESC' : 'ASC',
        },
      };
      if (query) {
        findParams.where = {
          title: query,
        };
      }
      const [campaigns, total] = await this.campaignRepository.findAndCount(
        findParams,
      );
      // const totalPage
      const result = {
        data: campaigns,
        page: skip,
        pageSize: findSize,
        totalCount: total,
        totalPages: total,
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} campaign`;
  }

  update(id: number, updateCampaignDto: UpdateCampaignDto) {
    return `This action updates a #${id} campaign`;
  }

  remove(id: number) {
    return `This action removes a #${id} campaign`;
  }
}
