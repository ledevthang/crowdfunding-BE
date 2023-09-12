import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { TxnPendingPayload, TxnSucceedPayload } from 'types/queue.type';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMailOnTxnPending(payload: TxnPendingPayload): Promise<void> {
    const {
      additionInfor,
      amout,
      email,
      receivingAccount,
      displayname,
      accountHoldername
    } = payload;

    await this.mailerService.sendMail({
      from: `crowdfunding platform`,
      to: payload.email,
      subject: `Crowdfunding Notification`,
      html: `
          <html lang="en">
          <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Crowdfunding Notification</title>
          </head>
          <body>
              <h2>Dear ${displayname || email}</h2>
              <br>
              The following is the transfer information for the funding transaction to .</br> Transfer information:
              Amount: <strong>${amout}$</strong> Receiving account: <strong>${receivingAccount}</strong>
              Account holder name: <strong>${accountHoldername}</strong>
              <br />
              Additional information: <strong>${additionInfor}</strong>
              </p>
              <p>Cheers,</p>
              <p>The Crowdfunding team</p>
          </body>
          </html>
        `
    });
  }
  async sendMailOnTxnSucceed(payload: TxnSucceedPayload): Promise<void> {
    const {
      additionInfor,
      amout,
      email,
      receivingAccount,
      displayname,
      accountHoldername
    } = payload;

    await this.mailerService.sendMail({
      from: `crowdfunding platform`,
      to: payload.email,
      subject: `Crowdfunding Notification`,
      html: `
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Crowdfunding Notification</title>
            </head>
            <body>
                <h2>Dear ${displayname || email}</h2>
                <br> We have successfully recorded your transaction.Transfer information:</br> Transfer information:
                Amount: <strong>${amout}$</strong> Receiving account: <strong>${receivingAccount}</strong>
                Account holder name: <strong>${accountHoldername}</strong>
                <br />
                Additional information: <strong>${additionInfor}</strong>
                </p>
                <p>Cheers,</p>
                <p>The Crowdfunding team</p>
            </body>
            </html>
          `
    });
  }

  async sendMailOnCpnEvent({
    email,
    username,
    event,
    campaignTitle
  }: {
    email: string;
    username: string;
    event: 'fail' | 'succeed';
    campaignTitle: string;
  }) {
    await this.mailerService.sendMail({
      from: `crowdfunding platform`,
      to: email,
      subject: `Crowdfunding Notification`,
      html: `
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Document</title>
            </head>
            <body>
              <h2>Dear ${username || email}</h2>
              <p>
                The campaign <strong>${campaignTitle}</strong> that you invested in has
                been ${event === 'fail' ? 'failed' : 'successful'}.
              </p>
              <p>Cheers,</p>
              <p>The Crowdfunding team</p>
            </body>
          </html>
      `
    });
  }
}
