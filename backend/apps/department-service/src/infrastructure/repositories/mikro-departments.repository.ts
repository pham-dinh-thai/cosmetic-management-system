import { Injectable } from '@nestjs/common';
import { IDepartmentsRepository } from '../../domain/repositories/departments.repository';
import { Department } from '../../domain/department.aggregate';
import { EntityManager } from '@mikro-orm/postgresql';
import { DepartmentsMapper } from '../mappers/departments.mapper';
import { Department as DepartmentMikro } from '../entities/department.entity';

@Injectable()
export class MikroDepartmentsRepository implements IDepartmentsRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(): Promise<Department[]> {
    const departmentsMikro = await this.entityManager.findAll(DepartmentMikro);

    return departmentsMikro.map((departmentMikro) =>
      DepartmentsMapper.toDomain(departmentMikro),
    );
  }

  public async findByCode(code: string): Promise<Department | null> {
    const departmentMikro = await this.entityManager.findOne(DepartmentMikro, {
      code,
    });

    return departmentMikro ? DepartmentsMapper.toDomain(departmentMikro) : null;
  }

  public async findById(id: string): Promise<Department | null> {
    const departmentMikro = await this.entityManager.findOne(DepartmentMikro, {
      id,
    });

    return departmentMikro ? DepartmentsMapper.toDomain(departmentMikro) : null;
  }

  public async create(department: Department): Promise<void> {
    this.entityManager.persist(DepartmentsMapper.toMikro(department));

    await this.entityManager.flush();
  }

  public async update(id: string, department: Department): Promise<void> {
    await this.entityManager.nativeUpdate(
      DepartmentMikro,
      { id },
      {
        code: department.getCode(),
        name: department.getName(),
        updatedAt: new Date(),
      },
    );
  }

  public async deactivate(id: string): Promise<void> {
    await this.entityManager.nativeUpdate(
      DepartmentMikro,
      { id },
      { isActive: false, updatedAt: new Date() },
    );
  }

  public async activate(id: string): Promise<void> {
    await this.entityManager.nativeUpdate(
      DepartmentMikro,
      { id },
      { isActive: true, updatedAt: new Date() },
    );
  }

  public async assignManager(department: Department): Promise<void> {
    await this.entityManager.nativeUpdate(
      DepartmentMikro,
      { id: department.getId() },
      { managerId: department.getManagerId(), updatedAt: new Date() },
    );
  }
}
