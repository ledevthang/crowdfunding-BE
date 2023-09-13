import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { CreateTransactionDto, FindTransactionDto } from './transaction.dto';
import { Prisma } from '@prisma/client';
import { Claims } from 'types/auth.type';
import { InjectQueue } from '@nestjs/bull';
import { MailJobs, Queues, TxnQueuePayload } from 'types/queue.type';
import { Queue } from 'bull';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(Queues.mail)
    private readonly emailQueue: Queue<TxnQueuePayload>
  ) {}

  async create(userId: number, createTransactionDto: CreateTransactionDto) {
    const { amount, campaignId } = createTransactionDto;
    const transaction = await this.prisma.transaction.create({
      data: {
        amount,
        campaignId,
        generatedNote: `Campaign ${campaignId} ${Math.floor(
          new Date().getTime() / 1000
        )}`,
        userId
      },
      select: {
        generatedNote: true,
        amount: true,
        id: true,
        campaign: {
          select: {
            title: true,
            campaignBank: {
              select: {
                bankName: true,
                accountHolderName: true,
                bankNumber: true
              }
            }
          }
        },
        user: {
          select: {
            displayName: true,
            email: true
          }
        }
      }
    });

    await this.emailQueue.add(MailJobs.TxnPending, {
      accountHoldername: transaction.campaign.campaignBank.accountHolderName,
      additionInfor: transaction.generatedNote,
      amout: transaction.amount,
      displayname: transaction.user.displayName,
      email: transaction.user.email,
      receivingAccount: transaction.campaign.campaignBank.bankNumber
    });

    return {
      ...transaction.campaign.campaignBank,
      campaignTitle: transaction.campaign.title,
      transactionId: transaction.id,
      amount: transaction.amount,
      note: transaction.generatedNote
    };
  }

  async find(findTransactionDto: FindTransactionDto, userId = undefined) {
    const {
      page,
      size,
      campaignId,
      minAmount,
      maxAmount,
      campaignTitle,
      startDate,
      endDate,
      states
    } = findTransactionDto;
    const skip = (page - 1) * size;

    const amountCondition: Prisma.FloatFilter<'Transaction'> = {};
    const campaignCondition: Prisma.CampaignWhereInput = {};

    const transactionCondition: Prisma.TransactionWhereInput = {
      completed: true
    };
    if (campaignId) {
      transactionCondition.campaignId = campaignId;
    }

    if (userId) {
      transactionCondition.userId = userId;
    }

    if (maxAmount) {
      amountCondition.lte = maxAmount;
    }

    if (minAmount) {
      amountCondition.gte = minAmount;
    }

    if (campaignTitle) {
      campaignCondition.title = {
        contains: campaignTitle,
        mode: 'insensitive'
      };
    }

    if (startDate && endDate) {
      transactionCondition.updateDate = {
        lte: endDate,
        gte: startDate
      };
    }

    if (states) {
      transactionCondition.status = {
        in: states
      };
    }

    transactionCondition.amount = amountCondition;
    transactionCondition.campaign = campaignCondition;

    const [transactions, count] = await Promise.all([
      this.prisma.transaction.findMany({
        where: transactionCondition,
        include: {
          campaign: {
            select: {
              title: true
            }
          }
        },
        take: size,
        skip: skip
      }),
      await this.prisma.transaction.count({ where: transactionCondition })
    ]);
    const result = transactions.map(item => {
      const newItem = { ...item, campaignTitle: item.campaign.title };
      delete newItem.campaign;
      return newItem;
    });
    return {
      data: result,
      page: page,
      size: size,
      totalPages: Math.ceil(count / size) || 0,
      totalElement: count
    };
  }

  async findOne(id: number, userClaims: Claims) {
    const transactionCondition: Prisma.TransactionWhereUniqueInput = { id };
    if (userClaims.role !== 'ADMIN') {
      transactionCondition.userId = userClaims.id;
    }

    const transaction = await this.prisma.transaction.findUnique({
      where: transactionCondition
    });

    if (!transaction) {
      throw new NotFoundException('Not found transaction!');
    }

    return transaction;
  }

  async complete(id: number, userId: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id }
    });
    if (!transaction) {
      throw new NotFoundException('Not found transaction!');
    }
    if (transaction.userId !== userId) {
      throw new ForbiddenException(
        'Transaction is not belong to current user!'
      );
    }
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        completed: true,
        updateDate: new Date()
      }
    });
    return updatedTransaction;
  }
}
