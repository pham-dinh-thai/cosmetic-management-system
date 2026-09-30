export type MailContent = {
  to: string;
  subject: string;
  html: string;
};

export type SendMailResult = {
  providerId: string | null;
};

export interface IMailSenderPort {
  send(content: MailContent): Promise<SendMailResult>;
}

export const MAIL_SENDER_PORT = 'IMailSenderPort';
