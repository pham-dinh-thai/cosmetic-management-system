import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { Position } from './position.enum';
import { ROLES_KEY } from './roles.decorator';
import { DEPARTMENTS_KEY } from './departments.decorator';
import { POSITIONS_KEY } from './positions.decorator';
import {
  EMPLOYEE_READER_PORT,
  type IEmployeeReaderPort,
} from './employee-reader.port';
import {
  DEPARTMENT_READER_PORT,
  type IDepartmentReaderPort,
} from './department-reader.port';

export const ACTIVE_EMPLOYEE_STATUS = 'ACTIVE';

type RequestUser = { sub?: string; roleId?: string };

@Injectable()
export class OrgGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    @Inject(EMPLOYEE_READER_PORT)
    private readonly employeeReaderPort: IEmployeeReaderPort,
    @Inject(DEPARTMENT_READER_PORT)
    private readonly departmentReaderPort: IDepartmentReaderPort,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
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

    if (!user.sub) {
      throw new ForbiddenException();
    }

    const permission = await this.loadPermission(user.sub);

    if (!permission) {
      throw new ForbiddenException();
    }

    if (
      requiredDepartments &&
      !requiredDepartments.includes(permission.departmentCode)
    ) {
      throw new ForbiddenException();
    }

    if (requiredPositions && !requiredPositions.includes(permission.position)) {
      throw new ForbiddenException();
    }

    return true;
  }

  private async loadPermission(userId: string): Promise<{
    departmentCode: string;
    position: Position;
  } | null> {
    const employee = await this.employeeReaderPort.findByUserId(userId);

    if (!employee || !employee.departmentId) {
      return null;
    }

    const department = await this.departmentReaderPort.findById(
      employee.departmentId,
    );

    if (!department) {
      return null;
    }

    if (employee.status !== ACTIVE_EMPLOYEE_STATUS || !department.isActive) {
      return null;
    }

    return {
      departmentCode: department.code,
      position: employee.position,
    };
  }
}
