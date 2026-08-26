import { Injectable } from '@nestjs/common';
import { IEmployeesRepository } from '../../domain/repositories/employees.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { Employee } from '../../domain/employee.aggregate';
import { EmployeesMapper } from '../mappers/employees.mapper';

@Injectable()
export class MikroEmployeesRepository implements IEmployeesRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async create(employee: Employee): Promise<void> {
    this.entityManager.persist(EmployeesMapper.toMikro(employee));

    await this.entityManager.flush();
  }
}
