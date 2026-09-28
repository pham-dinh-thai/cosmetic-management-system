import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { Position } from './position.enum';

// Shape của JWT access token do authentication-service ký
// (khớp với AccessTokenPayload trong sign-token.port.ts).
export interface JwtUser {
  sub: string;
  email: string;
  roleId: string;
  departmentCode?: string;
  position?: Position;
  permissions: string[];
}

export type CurrentUserField = keyof JwtUser;

type UserAwareRequest = Request & { user?: unknown };

/**
 * Lấy payload JWT đã được AuthGuard gắn vào request.user.
 *
 * Cách dùng:
 * @Get('me')
 * public async findMine(@CurrentUser() user?: JwtUser) { ... }   // → toàn bộ payload
 *
 * @Get(':id')
 * public async update(@CurrentUser('sub') userId?: string) { ... } // → 1 field, typed
 *
 * Trả về undefined khi route public / chưa có user.
 */
export const CurrentUser = createParamDecorator(
  (field: CurrentUserField | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<UserAwareRequest>();
    const user = request.user as JwtUser | undefined;

    if (!user) {
      return undefined;
    }

    if (field) {
      return user[field];
    }

    return user;
  },
);
