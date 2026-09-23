import { AuditLog } from '../../../../domain/audit-log.aggregate';
import { AuditAction } from '../../../../domain/types';

export class AuditLogDetailReadModel {
  private constructor(
    public readonly id: string,
    public readonly actorId: string | null,
    public readonly actorName: string | null,
    public readonly action: AuditAction,
    public readonly entityType: string,
    public readonly entityId: string | null,
    public readonly before: Record<string, unknown> | null,
    public readonly after: Record<string, unknown> | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly ipAddress: string | null,
    public readonly userAgent: string | null,
    public readonly createdAt: Date,
  ) {}

  public static from(auditLog: AuditLog): AuditLogDetailReadModel {
    return new AuditLogDetailReadModel(
      auditLog.getId(),
      auditLog.getActorId(),
      auditLog.getActorName(),
      auditLog.getAction(),
      auditLog.getEntityType(),
      auditLog.getEntityId(),
      auditLog.getBefore(),
      auditLog.getAfter(),
      auditLog.getMetadata(),
      auditLog.getIpAddress(),
      auditLog.getUserAgent(),
      auditLog.getCreatedAt(),
    );
  }
}
