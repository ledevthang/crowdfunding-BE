import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { KycInfor, KycStatus, Prisma } from '@prisma/client';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { Queue } from 'bull';
import { KycQueuePayload, MailJobs, Queues } from 'types/queue.type';
import { BasePagingResponse } from 'utils/base.dto';
import { KycCreate, KycQuery, KycUpdate } from './kyc.dto';

@Injectable()
export class KycService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(Queues.mail)
    private readonly emailQueue: Queue<KycQueuePayload>
  ) {}

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
    const newStatus: KycStatus =
      action === 'APPROVED' ? 'APPROVED' : 'REJECTED';

    const kyc = await this.prisma.kycInfor.update({
      where: {
        id
      },
      data: {
        status: newStatus
      },
      select: {
        user: {
          select: {
            displayName: true,
            email: true
          }
        }
      }
    });

    if (action === 'APPROVED')
      await this.emailQueue.add(MailJobs.KycApproved, {
        displayname: kyc.user.displayName,
        email: kyc.user.email
      });

    if (action === 'REJECTED')
      await this.emailQueue.add(MailJobs.KycApproved, {
        displayname: kyc.user.displayName,
        email: kyc.user.email
      });

    return {
      msg: 'ok'
    };
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

    const user = await this.prisma.user.update({
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
          upsert: {
            create: {
              risk: 'LOW',
              kycImages: {
                createMany: {
                  data: images.map(i => ({ url: i }))
                }
              }
            },
            update: {
              status: 'PENDING'
            }
          }
        }
      },
      select: {
        displayName: true,
        email: true
      }
    });

    await this.emailQueue.add(MailJobs.KycPending, {
      displayname: user.displayName,
      email: user.email
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
