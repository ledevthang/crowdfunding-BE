import { Injectable } from '@nestjs/common';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { CreateBankDto, FindBankDto } from './bank.dto';
import { BasePagingResponse } from 'utils/base.dto';
import { CampaignBank } from '@prisma/client';

@Injectable()
export class BankService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    page,
    size
  }: FindBankDto): Promise<BasePagingResponse<CampaignBank>> {
    const [banks, count] = await Promise.all([
      this.prisma.campaignBank.findMany({
        take: size,
        skip: (page - 1) * size
      }),
      this.prisma.campaignBank.count()
    ]);

    return {
      data: banks,
      page: page,
      size: size,
      totalPages: Math.ceil(count / size) || 0,
      totalElement: count
    };
  }

  async create(body: CreateBankDto) {
    const { accountHolderName, bankName, bankNumber } = body;
    return await this.prisma.campaignBank.create({
      data: {
        accountHolderName,
        bankName,
        bankNumber
      }
    });
  }
}
