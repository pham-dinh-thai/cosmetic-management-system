import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Gender } from '../../domain/enums/gender.enum';

const UserSchema = defineEntity({
  name: 'User',
  tableName: 'users',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    firstName: p.string(),
    lastName: p.string(),
    gender: p.enum(() => Gender),
    email: p.string().unique(),
    roleId: p.string(),
    isActive: p.boolean().default(true),
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
