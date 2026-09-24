import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { RequestUser } from './org.guard';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: RequestUser }>();

    if (!user?.roleId) {
      throw new ForbiddenException();
    }

    // Admin always allowed — mọi thao tác quản trị đều được phép.
    if (user.roleId === Role.Admin) {
      return true;
    }

    const granted = new Set(user.permissions ?? []);

    if (!required.every((permission) => granted.has(permission))) {
      throw new ForbiddenException();
    }

    return true;
  }
}