import { Employee } from '../../domain/employee.aggregate';
import { Employee as EmployeeMikro } from '../entities/employee.entity';

export class EmployeesMapper {
  public static toDomain(employeeMikro: EmployeeMikro): Employee {
    return Employee.fromPersistent({
      id: employeeMikro.id,
      userId: employeeMikro.userId,
      code: employeeMikro.code,
      departmentId: employeeMikro.departmentId,
      hiredAt: employeeMikro.hiredAt,
      status: employeeMikro.status,
      position: employeeMikro.position,
      phone: employeeMikro.phone ?? undefined,
      address: employeeMikro.address ?? undefined,
      createdAt: employeeMikro.createdAt,
      updatedAt: employeeMikro.updatedAt,
    });
  }

  public static toMikro(employee: Employee): EmployeeMikro {
    const employeeMikro = new EmployeeMikro();

    if (employee.getId()) {
      employeeMikro.id = employee.getId();
    }
    employeeMikro.userId = employee.getUserId();
    employeeMikro.code = employee.getCode();
    employeeMikro.departmentId = employee.getDepartmentId();
    employeeMikro.hiredAt = employee.getHiredAt();
    employeeMikro.position = employee.getPosition();
    employeeMikro.phone = employee.getPhone();
    employeeMikro.address = employee.getAddress();

    const createdAt = employee.getCreatedAt();
    const updatedAt = employee.getUpdatedAt();

    if (createdAt) {
      employeeMikro.createdAt = createdAt;
    }
    if (updatedAt) {
      employeeMikro.updatedAt = updatedAt;
    }

    return employeeMikro;
  }
}
