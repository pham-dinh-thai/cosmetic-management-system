import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { AuditAction } from '../../domain/types';

const AuditLogSchema = defineEntity({
  name: 'AuditLog',
  tableName: 'audit_logs',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    actorId: p.string().fieldName('actor_id').nullable(),
    actorName: p.string().fieldName('actor_name').nullable(),
    action: p.enum(AuditAction),
    entityType: p.string().fieldName('entity_type'),
    entityId: p.string().fieldName('entity_id').nullable(),
    before: p.json().fieldName('before_data').nullable(),
    after: p.json().fieldName('after_data').nullable(),
    metadata: p.json().nullable(),
    ipAddress: p.string().fieldName('ip_address').nullable(),
    userAgent: p.string().fieldName('user_agent').nullable(),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .onCreate(() => new Date()),
  },
});

export class AuditLog extends AuditLogSchema.class {
  [OptionalProps]?:
    | 'actorId'
    | 'actorName'
    | 'entityId'
    | 'before'
    | 'after'
    | 'metadata'
    | 'ipAddress'
    | 'userAgent'
    | 'createdAt';
}

AuditLogSchema.setClass(AuditLog);
