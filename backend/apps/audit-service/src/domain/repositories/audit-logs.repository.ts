import { AuditLog } from '../audit-log.aggregate';
import { AuditAction } from '../types';

export type FindAllAuditLogsOptions = {
  search?: string;
  action?: AuditAction;
  entityType?: string;
  entityId?: string;
  actorId?: string;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
};

export interface AuditLogsRepository {
  findAll(
    options: FindAllAuditLogsOptions,
  ): Promise<{ items: AuditLog[]; total: number }>;
  findById(id: string): Promise<AuditLog | null>;
  create(auditLog: AuditLog): Promise<{ id: string }>;
}

export const AUDIT_LOGS_REPOSITORY = 'AuditLogsRepository';