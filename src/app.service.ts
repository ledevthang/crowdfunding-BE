import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { KycRisk } from '@prisma/client';
import { MailService } from '_modules_/mail/mail.service';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { catchError, firstValueFrom } from 'rxjs';

type Mock = {
  risk: KycRisk;
};

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpService,
    private readonly mailService: MailService
  ) {}

  getHello(): string {
    return 'Hello kitty';
  }

  async kycMock(_userId: number): Promise<Mock> {
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

          return this.prisma.kycInfor.update({
            where: {
              userId: user.id
            },
            data: {
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

  @Cron(CronExpression.EVERY_10_SECONDS)
  async sendCpnStatusEmail() {
    const CHUNK_SIZE = 10;
    let i = 0;

    while (true) {
      let campaigns = await this.prisma.campaign.findMany({
        orderBy: {
          id: 'asc'
        },
        take: CHUNK_SIZE,
        skip: i * CHUNK_SIZE,
        select: {
          endAt: true,
          title: true,
          progress: true,
          user: {
            select: {
              email: true,
              displayName: true
            }
          }
        }
      });

      if (!campaigns.length) {
        return;
      }

      campaigns = campaigns.filter(c => {
        const end = c.endAt;
        const now = new Date();

        return (
          end.getDate() === now.getDate() &&
          end.getMonth() == now.getMonth() &&
          end.getFullYear() === now.getFullYear()
        );
      });

      await Promise.all(
        campaigns.map(c =>
          this.mailService.sendMailOnCpnEvent({
            campaignTitle: c.title,
            email: c.user.email,
            event: c.progress < 100 ? 'fail' : 'succeed',
            username: c.user.displayName
          })
        )
      );
      i++;
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateCampaignStatus() {
    await this.prisma.campaign.updateMany({
      where: {
        status: 'ON_GOING',
        endAt: {
          lte: (new Date()).toISOString()
        },
        progress: {
          lt: 100
        }
      },
      data: {
        status: 'FAILED'
      }
    });
  }
}
