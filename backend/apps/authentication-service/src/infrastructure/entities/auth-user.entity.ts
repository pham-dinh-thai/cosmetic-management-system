import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';

const AuthUserSchema = defineEntity({
  name: 'Authentication',
  tableName: 'auth_users',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    userId: p.uuid().unique(),
    password: p.string().hidden(),
    emailVerifiedAt: p.datetime().nullable(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class AuthUser extends AuthUserSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
}

AuthUserSchema.setClass(AuthUser);
