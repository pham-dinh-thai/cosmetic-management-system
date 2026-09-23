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

export type RecordAuditLogProps = {
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

export type FromPersistentAuditLogProps = {
  id: string;
  actorId?: string | null;
  actorName?: string | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
};
