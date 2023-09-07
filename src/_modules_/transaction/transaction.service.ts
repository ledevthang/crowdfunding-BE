import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { CreateTransactionDto, FindTransactionDto } from './transaction.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

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
            campaignBank: {
              select: {
                bankName: true,
                accountHolderName: true,
                bankNumber: true
              }
            }
          }
        }
      }
    });
    return {
      ...transaction.campaign.campaignBank,
      transactionId: transaction.id,
      amount: transaction.amount,
      note: transaction.generatedNote
    };
  }

  async find(findTransactionDto: FindTransactionDto, userId = undefined) {
    const { page, size, campaignId, status } = findTransactionDto;
    const skip = (page - 1) * size;

    const transactionCondition: Prisma.TransactionWhereInput = {
      completed: true
    };
    if (campaignId) {
      transactionCondition.campaignId = campaignId;
    }

    if (userId) {
      transactionCondition.userId = userId;
    }

    if (status) {
      transactionCondition.status = {
        in: status
      };
    }

    const [transactions, count] = await Promise.all([
      this.prisma.transaction.findMany({
        where: transactionCondition,
        take: size,
        skip: skip
      }),
      await this.prisma.transaction.count()
    ]);

    return {
      data: transactions,
      page: page,
      size: size,
      totalPages: Math.ceil(count / size) || 0,
      totalElement: count
    };
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
