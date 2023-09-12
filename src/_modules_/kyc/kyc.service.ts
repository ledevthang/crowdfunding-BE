import { Injectable } from '@nestjs/common';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { KycCreate, KycQuery, KycUpdate } from './kyc.dto';
import { BasePagingResponse } from 'utils/base.dto';
import { KycInfor, KycStatus, Prisma } from '@prisma/client';

@Injectable()
export class KycService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: KycQuery): Promise<BasePagingResponse<KycInfor>> {
    const {
      page,
      size,
      keywords,
      status,
      sortField,
      sortOrder,
      startDate,
      endDate
    } = query;

    const kycCondition: Prisma.KycInforWhereInput = {};
    let kycOrderBy: Prisma.KycInforOrderByWithRelationInput = {};

    if (keywords) {
      kycCondition.user = {
        displayName: {
          contains: keywords,
          mode: 'insensitive'
        }
      };
    }

    if (status) {
      kycCondition.status = {
        equals: status
      };
    }

    if (startDate && endDate) {
      kycCondition.updatedAt = {
        lte: endDate,
        gte: startDate
      };
    }

    if (sortField && sortOrder) {
      if (sortField === 'displayName') {
        kycOrderBy.user = {
          displayName: sortOrder
        };
      } else {
        kycOrderBy = {
          [sortField]: sortOrder
        };
      }
    }

    const [data, totalElement] = await Promise.all([
      this.prisma.kycInfor.findMany({
        where: kycCondition,
        orderBy: kycOrderBy,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              displayName: true,
              avatarPicture: true,
              phoneNumber: true,
              lastName: true,
              firstName: true
            }
          }
        },
        take: size,
        skip: (page - 1) * size
      }),
      this.prisma.kycInfor.count({
        where: kycCondition
      })
    ]);

    return {
      data,
      page,
      size,
      totalElement,
      totalPages: Math.ceil(totalElement / size)
    };
  }

  async update(body: KycUpdate) {
    const { action, id } = body;
    const newStatus: KycStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    return await this.prisma.kycInfor.update({
      where: {
        id
      },
      data: {
        status: newStatus
      }
    });
  }

  async create(body: KycCreate, userId: number) {
    const {
      city,
      country,
      dateOfBirth,
      firstName,
      lastName,
      phoneNumber,
      stateProvince,
      streetAddress,
      zip,
      images
    } = body;

    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        city,
        country,
        dateOfBirth,
        firstName,
        lastName,
        phoneNumber,
        stateProvince,
        streetAddress,
        zip,
        kycInfor: {
          create: {
            risk: 'LOW',
            kycImages: {
              createMany: {
                data: images.map(i => ({ url: i }))
              }
            }
          }
        }
      }
    });

    return {
      msg: 'ok'
    };
  }

  async delete(kycId: number) {
    await this.prisma.kycInfor.delete({
      where: {
        id: kycId
      }
    });
  }
}
