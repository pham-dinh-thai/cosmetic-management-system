import { AuditLog } from '../../../../domain/audit-log.aggregate';
import { AuditAction } from '../../../../domain/types';

export class AuditLogReadModel {
  private constructor(
    public readonly id: string,
    public readonly actorId: string | null,
    public readonly actorName: string | null,
    public readonly action: AuditAction,
    public readonly entityType: string,
    public readonly entityId: string | null,
    public readonly ipAddress: string | null,
    public readonly createdAt: Date,
  ) {}

  public static from(auditLog: AuditLog): AuditLogReadModel {
    return new AuditLogReadModel(
      auditLog.getId(),
      auditLog.getActorId(),
      auditLog.getActorName(),
      auditLog.getAction(),
      auditLog.getEntityType(),
      auditLog.getEntityId(),
      auditLog.getIpAddress(),
      auditLog.getCreatedAt(),
    );
  }
}
