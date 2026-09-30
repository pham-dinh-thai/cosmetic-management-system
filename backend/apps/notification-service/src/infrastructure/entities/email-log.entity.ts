import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { EmailLogStatus } from '../../domain/email-log';

const EmailLogSchema = defineEntity({
  name: 'EmailLog',
  tableName: 'email_logs',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    orderId: p.string().fieldName('order_id'),
    eventType: p.string().fieldName('event_type'),
    recipient: p.string(),
    subject: p.string(),
    status: p.enum(EmailLogStatus),
    providerId: p.string().fieldName('provider_id').nullable(),
    error: p.text().nullable(),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .onCreate(() => new Date()),
  },
  uniques: [
    {
      name: 'email_logs_order_event_unique',
      properties: ['orderId', 'eventType'],
    },
  ],
});

export class EmailLog extends EmailLogSchema.class {
  [OptionalProps]?: 'providerId' | 'error' | 'createdAt';
}

EmailLogSchema.setClass(EmailLog);
