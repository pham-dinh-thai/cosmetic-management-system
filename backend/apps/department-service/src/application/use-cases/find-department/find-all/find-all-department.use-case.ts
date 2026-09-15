import { IDepartmentsRepository } from 'apps/department-service/src/domain/repositories/departments.repository';
import { IEmployeeReaderPort } from '../../assign-manager-to-department/ports/employee-reader.port';
import {
  DepartmentManagerReadModel,
  FindAllDepartmentReadModel,
} from './read-models/find-all-department.read-model';

export class FindAllDepartmentUseCase {
  public constructor(
    private readonly departmentsRepository: IDepartmentsRepository,
    private readonly employeeReaderPort: IEmployeeReaderPort,
  ) {}

  public async execute(): Promise<FindAllDepartmentReadModel[]> {
    const departments = await this.departmentsRepository.findAll();

    const readModels = await Promise.all(
      departments.map(async (department) => {
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

        return new FindAllDepartmentReadModel(
          department.getId(),
          department.getCode(),
          department.getName(),
          department.getIsActive(),
          managerId,
          manager,
        );
      }),
    );

    return readModels;
  }
}

export const findAllDepartmentUseCaseFactory = (
  departmentsRepository: IDepartmentsRepository,
  employeeReaderPort: IEmployeeReaderPort,
) =>
  new FindAllDepartmentUseCase(departmentsRepository, employeeReaderPort);