import { Injectable } from '@nestjs/common';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { KycCreate, KycQuery, KycUpdate } from './kyc.dto';
import { BasePagingResponse } from 'utils/base.dto';
import { KycInfor, KycStatus } from '@prisma/client';

@Injectable()
export class KycService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: KycQuery): Promise<BasePagingResponse<KycInfor>> {
    const { page, size } = query;

    const [data, totalElement] = await Promise.all([
      this.prisma.kycInfor.findMany({
        where: {
          user: {
            role: 'FUNDRASIER'
          }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              displayName: true,
              avatarPicture: true,
              phoneNumber: true
            }
          }
        },
        take: size,
        skip: (page - 1) * size
      }),
      this.prisma.kycInfor.count({
        where: {
          user: {
            role: 'FUNDRASIER'
          }
        }
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
      email,
      firstName,
      lastName,
      phoneNumber,
      stateProvince,
      streetAddress,
      zip,
      images
    } = body;

    return await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        city,
        country,
        dateOfBirth,
        email,
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
  }
}
