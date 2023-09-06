import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { KycRisk } from '@prisma/client';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { catchError, firstValueFrom } from 'rxjs';

type Mock = {
  risk: KycRisk;
};

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpService
  ) {}

  getHello(): string {
    return 'Hello kitty';
  }

  async kycMock(): Promise<Mock> {
    const rand = Math.floor(Math.random() * 3);
    return {
      risk: Object.values(KycRisk)[rand]
    };
  }

  @Cron(CronExpression.EVERY_10_HOURS)
  async updateKyc() {
    const CHUNK_SIZE = 60;
    let i = 0;

    while (true) {
      const users = await this.prisma.user.findMany({
        orderBy: {
          id: 'asc'
        },
        take: CHUNK_SIZE,
        skip: i * CHUNK_SIZE
      });

      if (!users.length) return;

      await Promise.all(
        users.map(async user => {
          const { risk } = await this.getKyc(user.id);

          return this.prisma.kycInfor.upsert({
            where: {
              userId: user.id
            },
            create: {
              risk,
              userId: user.id
            },
            update: {
              risk
            }
          });
        })
      );

      i++;
    }
  }

  private async getKyc(userId: number): Promise<Mock> {
    const { data } = await firstValueFrom(
      this.http
        .get<Mock>('/kyc-mock', {
          params: {
            userId
          }
        })
        .pipe(
          catchError(err => {
            throw err;
          })
        )
    );

    return data;
  }
}
