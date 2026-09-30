import { EmailLog, EmailLogProps } from '../email-log';

export interface IEmailLogsRepository {
  findByOrderAndEvent(
    orderId: string,
    eventType: string,
  ): Promise<EmailLog | null>;
  findMany(orderId?: string): Promise<EmailLog[]>;
  save(log: EmailLogProps): Promise<{ id: string }>;
}

export const EMAIL_LOGS_REPOSITORY = 'IEmailLogsRepository';
