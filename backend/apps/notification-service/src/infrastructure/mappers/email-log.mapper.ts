import { EmailLog as EmailLogDomain } from '../../domain/email-log';
import { EmailLog } from '../entities/email-log.entity';

export const EmailLogMapper = {
  toDomain(entity: EmailLog): EmailLogDomain {
    return EmailLogDomain.fromPersistent({
      id: entity.id,
      orderId: entity.orderId,
      eventType: entity.eventType,
      recipient: entity.recipient,
      subject: entity.subject,
      status: entity.status,
      providerId: entity.providerId ?? null,
      error: entity.error ?? null,
      createdAt: entity.createdAt,
    });
  },
};
