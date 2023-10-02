import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {
  CampaignQueuePayload,
  KycPayload,
  TxnPendingPayload,
  TxnSucceedPayload
} from 'types/queue.type';

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
      accountHoldername,
      campaignTitle
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
              The following is the transfer information for the funding transaction to campaign ${campaignTitle}.</br> Transfer information:
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
      accountHoldername,
      campaignTitle
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
                <br> We have successfully recorded your transaction to campaign ${campaignTitle}.Transfer information:</br> Transfer information:
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

  async sendMailOnKycPending(payload: KycPayload): Promise<void> {
    const { displayname, email } = payload;

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
                <h2>Dear ${displayname || email},</h2>
                <br />
                <p>Your KYC profile has been received, the results will be sent to you soon.</p>
                <br />
                <p>Cheers,</p>
                <p>The Crowdfunding team</p>
            </body>
            </html>
          `
    });
  }

  async sendMailOnKycApproved(payload: KycPayload): Promise<void> {
    const { displayname, email } = payload;

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
                <h2>Dear ${displayname || email},</h2>
                <br />
                <p>Your KYC profile has been approved, now you can make investments in campaigns.</p>
                <br />
                <p>Cheers,</p>
                <p>The Crowdfunding team</p>
            </body>
            </html>
          `
    });
  }

  async sendMailOnKycRejected(payload: KycPayload): Promise<void> {
    const { displayname, email } = payload;

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
                <h2>Dear ${displayname || email},</h2>
                <br />
                <p>Your KYC profile has been rejected, please contact the admin or perform KYC again to continue investing.</p>
                <br />
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

  async sendMailOnCpnPending(payload: CampaignQueuePayload): Promise<void> {
    const { email, userName, campaignName } = payload;

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
                <h2>Dear ${userName || email},</h2>
                <br />
                <p>Request to create the campaign <strong>${campaignName}</strong> has been received, the results will be sent to you soon.</p>
                <br />
                <p>Cheers,</p>
                <p>The Crowdfunding team</p>
            </body>
            </html>
          `
    });
  }

  async sendMailOnCpnApproved(payload: CampaignQueuePayload): Promise<void> {
    const { email, userName, campaignName } = payload;

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
                <h2>Dear ${userName || email},</h2>
                <br />
                <p>Request to create the campaign <strong>${campaignName}</strong> has been approved, please contact the admin if you have any questions.</p>
                <br />
                <p>Cheers,</p>
                <p>The Crowdfunding team</p>
            </body>
            </html>
          `
    });
  }

  async sendMailOnCpnRejected(payload: CampaignQueuePayload): Promise<void> {
    const { email, userName, campaignName } = payload;

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
                <h2>Dear ${userName || email},</h2>
                <br />
                <p>Request to create the campaign <strong>${campaignName}</strong> has been rejected, please contact the admin if you have any questions.</p>
                <br />
                <p>Cheers,</p>
                <p>The Crowdfunding team</p>
            </body>
            </html>
          `
    });
  }
}
