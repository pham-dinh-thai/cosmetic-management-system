import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { AuditLog as AuditLogDomain } from '../../domain/audit-log.aggregate';
import { AuditLogsRepository } from '../../domain/repositories/audit-logs.repository';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditLogMapper } from '../mappers/audit-log.mapper';

@Injectable()
export class MikroAuditLogsRepository implements AuditLogsRepository {
  private readonly em: EntityManager;

  public constructor(em: EntityManager) {
    this.em = em;
  }

  public async findAll(options: {
    search?: string;
    action?: string;
    entityType?: string;
    entityId?: string;
    actorId?: string;
    fromDate?: Date;
    toDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ items: AuditLogDomain[]; total: number }> {
    const where: Record<string, unknown> = {};

    if (options?.action) {
      where.action = options.action;
    }

    if (options?.entityType) {
      where.entityType = options.entityType;
    }

    if (options?.entityId) {
      where.entityId = options.entityId;
    }

    if (options?.actorId) {
      where.actorId = options.actorId;
    }

    if (options?.search) {
      where.$or = [
        { entityType: { $ilike: `%${options.search}%` } },
        { entityId: { $ilike: `%${options.search}%` } },
        { actorName: { $ilike: `%${options.search}%` } },
      ];
    }

    if (options?.fromDate || options?.toDate) {
      where.createdAt = {
        ...(options?.fromDate ? { $gte: options.fromDate } : {}),
        ...(options?.toDate ? { $lte: options.toDate } : {}),
      };
    }

    const page = options.page !== undefined ? options.page : 1;
    const limit = options.limit !== undefined ? options.limit : 20;

    const [entities, total] = await this.em.findAndCount(AuditLog, where, {
      orderBy: { createdAt: 'DESC' },
      offset: (page - 1) * limit,
      limit,
    });

    return {
      items: entities.map((entity) => AuditLogMapper.toDomain(entity)),
      total,
    };
  }

  public async findById(id: string): Promise<AuditLogDomain | null> {
    const entity = await this.em.findOne(AuditLog, { id });

    return entity ? AuditLogMapper.toDomain(entity) : null;
  }

  public async create(auditLog: AuditLogDomain): Promise<{ id: string }> {
    const entity = this.em.create(AuditLog, {
      actorId: auditLog.getActorId(),
      actorName: auditLog.getActorName(),
      action: auditLog.getAction(),
      entityType: auditLog.getEntityType(),
      entityId: auditLog.getEntityId(),
      before: auditLog.getBefore(),
      after: auditLog.getAfter(),
      metadata: auditLog.getMetadata(),
      ipAddress: auditLog.getIpAddress(),
      userAgent: auditLog.getUserAgent(),
    });

    await this.em.flush();

    return { id: entity.id };
  }
}
