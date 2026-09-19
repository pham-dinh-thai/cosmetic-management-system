import { EmployeeNotFoundException } from 'apps/employee-service/src/domain/exceptions/employee-not-found.exception';
import { IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';
import { IAssignDepartmentToEmployeeRequest } from './assign-department-to-employee.request';
import { IDepartmentsReaderPort } from '../../ports/departments-reader.port';
import { DepartmentNotFoundException } from 'apps/employee-service/src/domain/exceptions/department-not-found.exception';
import { IDepartmentManagerPort } from '../../ports/department-manager.port';
import { DepartmentNotActiveException } from 'apps/employee-service/src/domain/exceptions/department-not-active.exception';

export class AssignDepartmentToEmployeeUseCase {
  public constructor(
    private readonly employeesRepository: IEmployeesRepository,
    private readonly departmentsReaderPort: IDepartmentsReaderPort,
    private readonly departmentManagerPort: IDepartmentManagerPort,
  ) {}

  public async execute(
    id: string,
    request: IAssignDepartmentToEmployeeRequest,
  ): Promise<void> {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new EmployeeNotFoundException(id);
    }

    const department = await this.departmentsReaderPort.findById(
      request.departmentId,
    );

    if (!department) {
      throw new DepartmentNotFoundException(request.departmentId);
    }

    // Không cho chuyển nhân viên vào phòng ban đã bị vô hiệu hóa.
    if (!department.isActive) {
      throw new DepartmentNotActiveException(request.departmentId);
    }

    const currentDepartmentId = employee.getDepartmentId();

    // Theo nghiệp vụ: nếu nhân viên đang làm trưởng phòng của phòng ban cũ,
    // gỡ vai trò trưởng phòng TRƯỚC rồi mới chuyển phòng ban. Nếu lệnh gỡ
    // thất bại thì chưa có mutation nào → trạng thái sạch, thử lại được.
    if (currentDepartmentId && currentDepartmentId !== department.id) {
      await this.departmentManagerPort.unassignManager(employee.getId());
    }

    employee.assignDepartment(department.id);

    await this.employeesRepository.assignDepartment(employee);
  }
}

export const assignDepartmentToEmployeeUseCaseFactory = (
  employeesRepository: IEmployeesRepository,
  departmentsReaderPort: IDepartmentsReaderPort,
  departmentManagerPort: IDepartmentManagerPort,
): AssignDepartmentToEmployeeUseCase =>
  new AssignDepartmentToEmployeeUseCase(
    employeesRepository,
    departmentsReaderPort,
    departmentManagerPort,
  );