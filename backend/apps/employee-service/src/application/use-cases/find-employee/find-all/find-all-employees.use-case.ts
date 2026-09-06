import { IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';
import { IFindUserInformationPort } from '../../update-employee-information/ports/find-user-information.port';
import { IEmployeeLoggerPort } from 'apps/employee-service/src/application/ports/employee-logger.port';
import { FindAllEmployeeReadModel } from './read-models/find-all-employee.read-model';

export class FindAllEmployeesUseCase {
  public constructor(
    private readonly employeesRepository: IEmployeesRepository,
    private readonly findUserInformationPort: IFindUserInformationPort,
    private readonly logger: IEmployeeLoggerPort,
  ) {}

  public async execute(): Promise<FindAllEmployeeReadModel[]> {
    const employees = await this.employeesRepository.findAll();

    const readModels = await Promise.all(
      employees.map(async (employee) => {
        let userInfo: {
          firstName: string;
          lastName: string;
          gender: string;
          email?: string;
        } | null = null;

        try {
          userInfo = await this.findUserInformationPort.execute(
            employee.getUserId(),
          );
        } catch (error) {
          this.logger.warn(
            `Failed to load user information for employee ${employee.getId()}`,
            error instanceof Error ? error.message : undefined,
          );
        }

        return new FindAllEmployeeReadModel(
          employee.getId(),
          employee.getUserId(),
          employee.getCode(),
          employee.getDepartmentId(),
          employee.getHiredAt(),
          employee.getStatus(),
          employee.getPosition(),
          employee.getPhone(),
          employee.getAddress(),
          userInfo?.firstName,
          userInfo?.lastName,
          userInfo?.gender,
          userInfo?.email,
        );
      }),
    );

    return readModels;
  }
}

export const findAllEmployeesUseCaseFactory = (
  employeesRepository: IEmployeesRepository,
  findUserInformationPort: IFindUserInformationPort,
  logger: IEmployeeLoggerPort,
): FindAllEmployeesUseCase =>
  new FindAllEmployeesUseCase(
    employeesRepository,
    findUserInformationPort,
    logger,
  );