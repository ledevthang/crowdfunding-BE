import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './entities/campaign.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingDto, ResponsePaging } from 'src/base/base.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}
  async create(
    user: User,
    createCampaignDto: CreateCampaignDto,
  ): Promise<Boolean> {
    const { title, description, location, endAt, goal, imageUrl, categoryId } =
      createCampaignDto;
    try {
      if (user.roleId !== 1) {
        throw new UnauthorizedException();
      }
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
        creatorId: user.id,
        imageUrl,
        categoryId,
      };
      await this.campaignRepository.save(campaign);
      return true;
    } catch (error) {
      throw error;
    }
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
        relations: ['creator', 'category']
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

  async findOne(id: number) : Promise<Campaign> {
    try {
      const campaign = this.campaignRepository.findOne({where: {id: id}, relations: ['creator', 'category']});
      return campaign;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateCampaignDto: UpdateCampaignDto) {
    return `This action updates a #${id} campaign`;
  }

  remove(id: number) {
    return `This action removes a #${id} campaign`;
  }
}
