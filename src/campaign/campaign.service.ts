import { TransactionService } from './../transaction/transaction.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CampaignDto, CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { Campaign } from './entities/campaign.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingDto, ResponsePaging } from 'src/base/base.dto';
import { User } from 'src/user/entities/user.entity';
import { transactionStatus } from 'src/base/enum';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    private readonly transactionService: TransactionService,
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

  async find(pagingDto: PagingDto) : Promise<ResponsePaging<CampaignDto>> {
    try {
      const { page, size, query, order } = pagingDto;
      const findSize = size ? +size : 10;
      const skip = page ? (page - 1) * size : 0;
      const findParams: FindManyOptions<Campaign> = {
        take: findSize,
        skip: skip,
        order: {
          id: order === 'desc' ? 'DESC' : 'ASC',
        },
        relations: ['creator', 'category', 'transactions'],
      };
      if (query) {
        findParams.where = {
          title: query,
        };
      }
      const [campaigns, total] = await this.campaignRepository.findAndCount(
        findParams,
      );
      console.log('campaigns', campaigns)

      const campaignsWithTotalAmount = campaigns.map(campaign => {
        const newCampaign = campaign as CampaignDto
        // Other campaign fields
        const totalAmount = newCampaign.transactions.reduce((total, transaction) => {
          if (transaction.status === transactionStatus['ACCEPTED']) {
            return total + transaction.amount
          }
        }, 0)
        newCampaign.investedAmount = totalAmount
        const progres = (newCampaign.investedAmount / newCampaign.goal) * 100
        newCampaign.progress = +progres.toFixed(2)
        return newCampaign
      }) as unknown as CampaignDto[];

      // const totalPage
      const result = {
        data: campaignsWithTotalAmount,
        page: page,
        pageSize: findSize,
        totalCount: total,
        totalPages: Math.ceil(total / findSize),
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findForAdmin(userId: number, pagingDto: PagingDto) : Promise<ResponsePaging<CampaignDto>> {
    try {
      const { page, size, query, order } = pagingDto;
      const findSize = size ? +size : 10;
      const skip = page ? (page - 1) * size : 0;
      const findParams: FindManyOptions<Campaign> = {
        take: findSize,
        skip: skip,
        order: {
          id: order === 'desc' ? 'DESC' : 'ASC',
        },
        relations: ['creator', 'category', 'transactions'],
      };
      if (userId) {
        findParams.where = {...findParams.where, creatorId: userId};
      }
      if (query) {
        findParams.where = {...findParams.where, title: query};
      }
      const [campaigns, total] = await this.campaignRepository.findAndCount(
        findParams,
      );
      console.log('campaigns', campaigns)

      const campaignsWithTotalAmount = campaigns.map(campaign => {
        const newCampaign = campaign as CampaignDto
        // Other campaign fields
        const totalAmount = newCampaign.transactions.reduce((total, transaction) => {
          if (transaction.status === transactionStatus['ACCEPTED']) {
            return total + transaction.amount
          }
        }, 0)
        newCampaign.investedAmount = totalAmount
        const progres = (newCampaign.investedAmount / newCampaign.goal) * 100
        newCampaign.progress = +progres.toFixed(2)
        return newCampaign
      }) as unknown as CampaignDto[];

      // const totalPage
      const result = {
        data: campaignsWithTotalAmount,
        page: page,
        pageSize: findSize,
        totalCount: total,
        totalPages: Math.ceil(total / findSize),
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findForUser(userId, pagingDto: PagingDto) : Promise<ResponsePaging<CampaignDto>> {
    try {
      const { page, size, query, order } = pagingDto;
      const findSize = size ? +size : 10;
      const skip = page ? (page - 1) * size : 0;
      const findParams: FindManyOptions<Campaign> = {
        take: findSize,
        skip: skip,
        order: {
          id: order === 'desc' ? 'DESC' : 'ASC',
        },
        relations: ['creator', 'category', 'transactions'],
      };
      if (userId) {
        findParams.where = {
          transactions: {
            creatorId: userId
          },
        };
      }
      if (query) {
        findParams.where = {...findParams.where, title: query};
      }
      const [campaigns, total] = await this.campaignRepository.findAndCount(
        findParams,
      );
      const campaignsWithTotalAmount = campaigns.map(campaign => {
        const newCampaign = campaign as CampaignDto
        // Other campaign fields
        const totalAmount = newCampaign.transactions.reduce((total, transaction) => {
          if (transaction.status === transactionStatus['ACCEPTED']) {
            return total + transaction.amount
          }
        }, 0)
        newCampaign.investedAmount = totalAmount
        const progres = (newCampaign.investedAmount / newCampaign.goal) * 100
        newCampaign.progress = +progres.toFixed(2)
        return newCampaign
      }) as unknown as CampaignDto[];

      // const totalPage
      const result = {
        data: campaignsWithTotalAmount,
        page: page,
        pageSize: findSize,
        totalCount: total,
        totalPages: Math.ceil(total / findSize),
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) : Promise<CampaignDto> {
    try {
      const campaign = await this.campaignRepository.findOne({where: {id: id}, relations: ['creator', 'category', 'transactions']});
      const newCampaign = campaign as CampaignDto;
      const totalAmount = newCampaign.transactions.reduce((total, transaction) => {
        if (transaction.status === transactionStatus['ACCEPTED']) {
          return total + transaction.amount
        }
      }, 0)
      newCampaign.investedAmount = totalAmount
      const progres = (newCampaign.investedAmount / newCampaign.goal) * 100
      newCampaign.progress = +progres.toFixed(2)
      return newCampaign;
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
