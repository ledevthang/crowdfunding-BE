import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailConsumer } from './mail.consumer';
import { BullModule } from '@nestjs/bull';
import { Queues } from 'types/queue.type';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          service: 'gmail',
          auth: {
            user: configService.get<string>('MAIL_APP'),
            pass: configService.get<string>('MAIL_PASS')
          }
        }
      })
    }),
    BullModule.registerQueue({
      name: Queues.mail
    })
  ],
  providers: [MailService, MailConsumer],
  exports: [MailService]
})
export class MailModule {}
