import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';

const UserSchema = defineEntity({
  name: 'User',
  tableName: 'users',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    email: p.string().unique(),
    name: p.string(),
    password: p.string().hidden(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export class User extends UserSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
}

UserSchema.setClass(User);
