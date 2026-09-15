import { IDepartmentsRepository } from 'apps/department-service/src/domain/repositories/departments.repository';
import { IEmployeeReaderPort } from '../../assign-manager-to-department/ports/employee-reader.port';
import {
  DepartmentManagerReadModel,
  FindDepartmentByIdReadModel,
} from './read-models/find-department-by-id.read-model';

export class FindDepartmentByIdUseCase {
  public constructor(
    private readonly departmentsRepository: IDepartmentsRepository,
    private readonly employeeReaderPort: IEmployeeReaderPort,
  ) {}

  public async execute(
    id: string,
  ): Promise<FindDepartmentByIdReadModel | null> {
    const department = await this.departmentsRepository.findById(id);

    if (!department) {
      return null;
    }

    const managerId = department.getManagerId();
    let manager: DepartmentManagerReadModel | null = null;

    if (managerId) {
      const employee = await this.employeeReaderPort.findById(managerId);
      manager = employee
        ? new DepartmentManagerReadModel(
            employee.id,
            employee.code,
            [employee.firstName, employee.lastName]
              .filter((part) => !!part)
              .join(' ') || employee.code,
            employee.position,
          )
        : null;
    }

    return new FindDepartmentByIdReadModel(
      department.getId(),
      department.getCode(),
      department.getName(),
      department.getIsActive(),
      managerId,
      manager,
    );
  }
}

export const findDepartmentByIdUseCaseFactory = (
  departmentsRepository: IDepartmentsRepository,
  employeeReaderPort: IEmployeeReaderPort,
) =>
  new FindDepartmentByIdUseCase(departmentsRepository, employeeReaderPort);