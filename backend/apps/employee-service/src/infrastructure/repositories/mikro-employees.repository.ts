import { Injectable } from '@nestjs/common';
import { IEmployeesRepository } from '../../domain/repositories/employees.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { Employee } from '../../domain/employee.aggregate';
import { EmployeesMapper } from '../mappers/employees.mapper';
import { Employee as EmployeeMikro } from '../entities/employee.entity';

@Injectable()
export class MikroEmployeesRepository implements IEmployeesRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findById(id: string): Promise<Employee | null> {
    const employeeMikro = await this.entityManager.findOne(EmployeeMikro, {
      id,
    });

    return employeeMikro ? EmployeesMapper.toDomain(employeeMikro) : null;
  }

  public async create(employee: Employee): Promise<void> {
    this.entityManager.persist(EmployeesMapper.toMikro(employee));

    await this.entityManager.flush();
  }

  public async updateInformation(employee: Employee): Promise<void> {
    await this.entityManager.nativeUpdate(
      EmployeeMikro,
      { id: employee.getId() },
      {
        phone: employee.getPhone() ?? null,
        address: employee.getAddress() ?? null,
        updatedAt: new Date(),
      },
    );
  }
}
