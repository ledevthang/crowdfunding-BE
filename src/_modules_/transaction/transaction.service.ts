import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { CreateTransactionDto } from './transaction.dto';

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
      }
    });
    const campaign = await this.prisma.campaign.findFirst({
      where: {
        id: campaignId
      },
      include: {
        campaignBank: {
          select: {
            bankName: true,
            accountHolderName: true,
            bankNumber: true
          }
        }
      }
    });
    campaign.campaignBank;
    return {
      ...campaign.campaignBank,
      transactionId: transaction.id,
      amount: transaction.amount,
      note: transaction.generatedNote
    };
  }

  async complete(id: number, userId: number) {
    console.log(id, userId);
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId }
    });
    if (transaction) {
      const updatedTransaction = await this.prisma.transaction.update({
        where: { id },
        data: {
          completed: true,
          updateDate: new Date()
        }
      });
      return updatedTransaction;
    } else {
      throw new NotFoundException('Not found transaction!');
    }
  }
}
