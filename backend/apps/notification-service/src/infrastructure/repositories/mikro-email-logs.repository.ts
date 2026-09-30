import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { EmailLogProps } from '../../domain/email-log';
import { IEmailLogsRepository } from '../../domain/repositories/email-logs.repository';
import { EmailLog } from '../entities/email-log.entity';
import { EmailLogMapper } from '../mappers/email-log.mapper';

@Injectable()
export class MikroEmailLogsRepository implements IEmailLogsRepository {
  public constructor(private readonly em: EntityManager) {}

  public async findByOrderAndEvent(orderId: string, eventType: string) {
    const entity = await this.em.findOne(EmailLog, { orderId, eventType });

    return entity ? EmailLogMapper.toDomain(entity) : null;
  }

  public async findMany(orderId?: string) {
    const entities = await this.em.find(EmailLog, orderId ? { orderId } : {}, {
      orderBy: { createdAt: 'DESC' },
      limit: 100,
    });

    return entities.map((entity) => EmailLogMapper.toDomain(entity));
  }

  public async save(log: EmailLogProps): Promise<{ id: string }> {
    const entity = this.em.create(EmailLog, {
      orderId: log.orderId,
      eventType: log.eventType,
      recipient: log.recipient,
      subject: log.subject,
      status: log.status,
      providerId: log.providerId ?? null,
      error: log.error ?? null,
    });

    await this.em.flush();

    return { id: entity.id };
  }
}
