import { AuditLog as AuditLogDomain } from '../../domain/audit-log.aggregate';
import { AuditLog as AuditLogEntity } from '../entities/audit-log.entity';

export class AuditLogMapper {
  public static toDomain(entity: AuditLogEntity): AuditLogDomain {
    return AuditLogDomain.fromPersistent({
      id: entity.id,
      actorId: entity.actorId,
      actorName: entity.actorName,
      action: entity.action,
      entityType: entity.entityType,
      entityId: entity.entityId,
      before: entity.before as Record<string, unknown> | null,
      after: entity.after as Record<string, unknown> | null,
      metadata: entity.metadata as Record<string, unknown> | null,
      ipAddress: entity.ipAddress,
      userAgent: entity.userAgent,
      createdAt: entity.createdAt,
    });
  }
}
