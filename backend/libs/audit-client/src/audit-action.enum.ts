export const AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  VIEW: 'VIEW',
  EXPORT: 'EXPORT',
  OTHER: 'OTHER',
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export type RecordAuditLogInput = {
  actorId?: string;
  actorName?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};
