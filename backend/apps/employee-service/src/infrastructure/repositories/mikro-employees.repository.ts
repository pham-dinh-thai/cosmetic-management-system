import { Injectable } from '@nestjs/common';
import { IEmployeesRepository } from '../../domain/repositories/employees.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { Employee } from '../../domain/employee.aggregate';
import { EmployeesMapper } from '../mappers/employees.mapper';
import { Employee as EmployeeMikro } from '../entities/employee.entity';
import { EMPLOYEE_CODE_PREFIX } from '../../domain/value-objects/employee-code.value-object';
import { maxSequenceFromCodes } from '@app/codes';

@Injectable()
export class MikroEmployeesRepository implements IEmployeesRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(): Promise<Employee[]> {
    const employeesMikro = await this.entityManager.find(EmployeeMikro, {});

    return employeesMikro.map((employeeMikro) =>
      EmployeesMapper.toDomain(employeeMikro),
    );
  }

  public async findById(id: string): Promise<Employee | null> {
    const employeeMikro = await this.entityManager.findOne(EmployeeMikro, {
      id,
    });

    return employeeMikro ? EmployeesMapper.toDomain(employeeMikro) : null;
  }

  public async findByUserId(userId: string): Promise<Employee | null> {
    const employeeMikro = await this.entityManager.findOne(EmployeeMikro, {
      userId,
    });

    return employeeMikro ? EmployeesMapper.toDomain(employeeMikro) : null;
  }

  public async findMaxCodeSequence(): Promise<number | null> {
    const employeesMikro = await this.entityManager.find(
      EmployeeMikro,
      {},
      {
        fields: ['code'],
        orderBy: { code: 'DESC' },
        limit: 1,
      },
    );

    if (employeesMikro.length === 0) {
      return null;
    }

    return maxSequenceFromCodes(EMPLOYEE_CODE_PREFIX, [employeesMikro[0].code]);
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

  public async delete(id: string): Promise<Employee | null> {
    const employeeMikro = await this.entityManager.findOne(EmployeeMikro, {
      id,
    });

    if (!employeeMikro) {
      return null;
    }

    const employee = EmployeesMapper.toDomain(employeeMikro);

    this.entityManager.remove(employeeMikro);
    await this.entityManager.flush();

    return employee;
  }

  public async assignDepartment(employee: Employee): Promise<void> {
    await this.entityManager.nativeUpdate(
      EmployeeMikro,
      { id: employee.getId() },
      {
        departmentId: employee.getDepartmentId(),
        updatedAt: new Date(),
      },
    );
  }

  public async updatePosition(employee: Employee): Promise<void> {
    await this.entityManager.nativeUpdate(
      EmployeeMikro,
      { id: employee.getId() },
      {
        position: employee.getPosition(),
        updatedAt: new Date(),
      },
    );
  }
}
