import { IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';
import { IFindUserInformationPort } from '../../update-employee-information/ports/find-user-information.port';
import { IEmployeeLoggerPort } from 'apps/employee-service/src/application/ports/employee-logger.port';
import { FindEmployeeByIdReadModel } from './read-models/find-employee-by-id.read-model';

export class FindEmployeeByIdUseCase {
  public constructor(
    private readonly employeesRepository: IEmployeesRepository,
    private readonly findUserInformationPort: IFindUserInformationPort,
    private readonly logger: IEmployeeLoggerPort,
  ) {}

  public async execute(id: string): Promise<FindEmployeeByIdReadModel | null> {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      return null;
    }

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

    return new FindEmployeeByIdReadModel(
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
      userInfo?.email,
    );
  }
}

export const findEmployeeByIdUseCaseFactory = (
  employeesRepository: IEmployeesRepository,
  findUserInformationPort: IFindUserInformationPort,
  logger: IEmployeeLoggerPort,
): FindEmployeeByIdUseCase =>
  new FindEmployeeByIdUseCase(
    employeesRepository,
    findUserInformationPort,
    logger,
  );