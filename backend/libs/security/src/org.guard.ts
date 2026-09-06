import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { Position } from './position.enum';
import { ROLES_KEY } from './roles.decorator';
import { DEPARTMENTS_KEY } from './departments.decorator';
import { POSITIONS_KEY } from './positions.decorator';

export type RequestUser = {
  sub?: string;
  roleId?: string;
  departmentCode?: string;
  position?: Position;
};

@Injectable()
export class OrgGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user ?? {};

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredDepartments = this.reflector.getAllAndOverride<string[]>(
      DEPARTMENTS_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requiredPositions = this.reflector.getAllAndOverride<Position[]>(
      POSITIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && !requiredDepartments && !requiredPositions) {
      return true;
    }

    if (requiredRoles && !requiredRoles.some((role) => user.roleId === role)) {
      throw new ForbiddenException();
    }

    if (!requiredDepartments && !requiredPositions) {
      return true;
    }

    // Admin bypasses department/position requirements.
    if (user.roleId === Role.Admin) {
      return true;
    }

    if (!user.departmentCode || !user.position) {
      throw new ForbiddenException();
    }

    if (
      requiredDepartments &&
      !requiredDepartments.includes(user.departmentCode)
    ) {
      throw new ForbiddenException();
    }

    if (requiredPositions && !requiredPositions.includes(user.position)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
