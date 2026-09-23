import { AuditLog } from '../../../domain/audit-log.aggregate';
import { AuditLogsRepository } from '../../../domain/repositories/audit-logs.repository';
import { AuditAction } from '../../../domain/types';

export type RecordAuditLogInput = {
  actorId?: string;
  actorName?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
};

export class RecordAuditLogUseCase {
  public constructor(
    private readonly auditLogsRepository: AuditLogsRepository,
  ) {}

  public async execute(input: RecordAuditLogInput): Promise<{ id: string }> {
    const auditLog = AuditLog.create(input);

    return await this.auditLogsRepository.create(auditLog);
  }
}

export const recordAuditLogUseCaseFactory = (
  auditLogsRepository: AuditLogsRepository,
): RecordAuditLogUseCase => new RecordAuditLogUseCase(auditLogsRepository);
