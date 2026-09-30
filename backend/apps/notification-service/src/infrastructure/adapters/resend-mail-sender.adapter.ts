import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import {
  IMailSenderPort,
  MailContent,
  SendMailResult,
} from '../../application/ports/mail-sender.port';

export class ResendMailSenderAdapter implements IMailSenderPort {
  private readonly client: Resend;
  private readonly from: string;

  public constructor(config: ConfigService) {
    this.client = new Resend(config.getOrThrow<string>('RESEND_API_KEY'));
    this.from = config.getOrThrow<string>('EMAIL_FROM');
  }

  public async send(content: MailContent): Promise<SendMailResult> {
    const { data, error } = await this.client.emails.send({
      from: this.from,
      to: content.to,
      subject: content.subject,
      html: content.html,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { providerId: data?.id ?? null };
  }
}
