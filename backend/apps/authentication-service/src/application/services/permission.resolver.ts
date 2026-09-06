import { Position } from '@app/security';
import { IEmployeePermissionReaderPort } from '../ports/employee-permission-reader.port';
import { IDepartmentPermissionReaderPort } from '../ports/department-permission-reader.port';

export const ACTIVE_EMPLOYEE_STATUS = 'ACTIVE';

export class PermissionResolver {
  public constructor(
    private readonly employeePermissionReaderPort: IEmployeePermissionReaderPort,
    private readonly departmentPermissionReaderPort: IDepartmentPermissionReaderPort,
  ) {}

  public async load(userId: string): Promise<{
    departmentCode: string;
    position: Position;
  } | null> {
    const employee =
      await this.employeePermissionReaderPort.findByUserId(userId);

    if (!employee || !employee.departmentId) {
      return null;
    }

    const department = await this.departmentPermissionReaderPort.findById(
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

export const permissionResolverFactory = (
  employeePermissionReaderPort: IEmployeePermissionReaderPort,
  departmentPermissionReaderPort: IDepartmentPermissionReaderPort,
): PermissionResolver =>
  new PermissionResolver(
    employeePermissionReaderPort,
    departmentPermissionReaderPort,
  );
