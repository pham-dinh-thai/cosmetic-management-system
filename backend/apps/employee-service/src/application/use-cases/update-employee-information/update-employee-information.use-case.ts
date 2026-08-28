import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUpdateEmployeeInformationRequest } from './update-employee-information.request';
import {
  EMPLOYEES_REPOSITORY,
  type IEmployeesRepository,
} from 'apps/employee-service/src/domain/repositories/employees.repository';

@Injectable()
export class UpdateEmployeeInformationUseCase {
  public constructor(
    @Inject(EMPLOYEES_REPOSITORY)
    private readonly employeesRepository: IEmployeesRepository,
  ) {}

  public async execute(
    id: string,
    request: IUpdateEmployeeInformationRequest,
  ): Promise<void> {
    const existing = await this.employeesRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
  }
}
