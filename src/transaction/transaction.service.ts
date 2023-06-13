import { Injectable } from '@nestjs/common';
import {
  ChangeTransactionStatusDto,
  CreateTransactionDto,
  TransactionPagingDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ResponsePaging, UserDto } from 'src/base/base.dto';
import { transactionStatus } from 'src/base/enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async create(
    creatorId: number,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Boolean> {
    try {
      const {
        amount,
        bankName,
        bankAccountNumber,
        bankerName,
        bankerAddress,
        bankerPhone,
        bankerZipCode,
        bankerEmail,
        note,
        campaignId,
      } = createTransactionDto;
      const transaction = {
        amount,
        bankName,
        bankAccountNumber,
        bankerName,
        bankerAddress,
        bankerPhone,
        bankerZipCode,
        bankerEmail,
        note,
        campaignId,
        creatorId,
      };
      const createdTransaction = this.transactionRepository.create(transaction);
      this.transactionRepository.save(createdTransaction);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async find(
    user: UserDto,
    pagingDto: TransactionPagingDto,
  ): Promise<ResponsePaging<Transaction>> {
    try {
      const { page, size, query, order, status } = pagingDto;
      const findSize = size ? +size : 10;
      const skip = page ? (page - 1) * size : 0;
      const findParams: FindManyOptions<Transaction> = {
        take: findSize,
        skip: skip,
        order: {
          id: order === 'desc' ? 'DESC' : 'ASC',
        },
        relations: ['campaign', 'creator'],
      };
      if (status && transactionStatus[status]) {
        findParams.where = {
          status: transactionStatus[status],
        };
      }
      if (user.roleId === 2) {
        findParams.where = {...findParams.where, creatorId: user.id};
      }
      const [campaigns, total] = await this.transactionRepository.findAndCount(
        findParams,
      );
      // const totalPage
      const result = {
        data: campaigns,
        page: page,
        pageSize: findSize,
        totalCount: total,
        totalPages: Math.ceil(total / findSize),
      };
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Transaction> {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id: id },
        relations: ['campaign', 'creator'],
      });
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async findTotalAmoutTransactionByCampaignId(campaignId: number) {
    try {
      const queryBuilder = this.transactionRepository.createQueryBuilder('transaction');
      queryBuilder.select('SUM(transaction.amount)', 'sum');
      queryBuilder.where('transaction.campaignId = :campaignId', { campaignId });
      queryBuilder.andWhere('transaction.status = :status', { status: transactionStatus['ACCEPTED'] });

      const result = await queryBuilder.getRawOne();
      const sum = result.sum || 0;

      return sum;
    } catch (error) {
      throw error;
    }
  }

  async changeStatus(
    id: number,
    changeTransactionStatusDto: ChangeTransactionStatusDto,
  ): Promise<Boolean> {
    try {
      const { status } = changeTransactionStatusDto;
      const transaction = await this.findOne(id);
      const updatedDate = new Date()
      transaction.status = status;
      transaction.updatedDate = updatedDate;
      await this.transactionRepository.save(transaction);
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findTransactionByCampaign(
    campaignId: number,
    creatorId: number,
    pagingDto: TransactionPagingDto,
  ): Promise<ResponsePaging<Transaction>> {
    try {
      const { page, size, query, order, status } = pagingDto;
      const findSize = size ? +size : 10;
      const skip = page ? (page - 1) * size : 0;
      const findParams: FindManyOptions<Transaction> = {
        take: findSize,
        skip: skip,
        order: {
          id: order === 'desc' ? 'DESC' : 'ASC',
        },
        relations: ['campaign', 'creator'],
      };
      findParams.where = {
        
        creatorId,
        campaignId
      };
      if (status) {
        findParams.where = {...findParams.where, status: transactionStatus[status]};
      }
      const [campaigns, total] = await this.transactionRepository.findAndCount(
        findParams,
      );
      // const totalPage
      const result = {
        data: campaigns,
        page: page,
        pageSize: findSize,
        totalCount: total,
        totalPages: Math.ceil(total / findSize),
      };
      return result;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
