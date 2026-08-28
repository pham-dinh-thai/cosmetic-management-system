import { IUpdateEmployeeInformationRequest } from './update-employee-information.request';
import { type IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';
import { type IUpdateUserInformationPort } from './ports/update-user-information.port';
import { type IFindUserInformationPort } from './ports/find-user-information.port';
import { EmployeeNotFoundException } from 'apps/employee-service/src/domain/exceptions/employee-not-found.exception';
import { type IEmployeeLoggerPort } from '../../ports/employee-logger.port';

export class UpdateEmployeeInformationUseCase {
  public constructor(
    private readonly employeesRepository: IEmployeesRepository,
    private readonly updateUserInformationPort: IUpdateUserInformationPort,
    private readonly findUserInformationPort: IFindUserInformationPort,
    private readonly logger: IEmployeeLoggerPort,
  ) {}

  public async execute(
    id: string,
    request: IUpdateEmployeeInformationRequest,
  ): Promise<void> {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new EmployeeNotFoundException(id);
    }

    const previousUserInformation = await this.findUserInformationPort.execute(
      employee.getUserId(),
    );

    await this.updateUserInformationPort.execute(employee.getUserId(), {
      firstName: request.user.firstName,
      lastName: request.user.lastName,
      gender: request.user.gender,
    });

    if (!request.phone && !request.address) {
      return;
    }

    if (request.phone) {
      employee.updatePhone(request.phone);
    }

    if (request.address) {
      employee.updateAddress(request.address);
    }

    try {
      await this.employeesRepository.updateInformation(employee);
    } catch (error) {
      this.logger.warn(
        `Failed to update employee ${id} after user update, rolling back user info`,
        error instanceof Error ? error.stack : undefined,
      );

      await this.updateUserInformationPort.execute(employee.getUserId(), {
        firstName: previousUserInformation.firstName,
        lastName: previousUserInformation.lastName,
        gender: previousUserInformation.gender,
      });

      throw error;
    }
  }
}

export const updateEmployeeInformationUseCaseFactory = (
  employeesRepository: IEmployeesRepository,
  updateUserInformationPort: IUpdateUserInformationPort,
  findUserInformationPort: IFindUserInformationPort,
  logger: IEmployeeLoggerPort,
): UpdateEmployeeInformationUseCase =>
  new UpdateEmployeeInformationUseCase(
    employeesRepository,
    updateUserInformationPort,
    findUserInformationPort,
    logger,
  );
