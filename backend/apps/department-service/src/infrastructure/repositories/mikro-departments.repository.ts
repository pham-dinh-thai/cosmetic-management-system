import { Injectable } from '@nestjs/common';
import { IDepartmentsRepository } from '../../domain/repositories/departments.repository';
import { Department } from '../../domain/department.aggregate';
import { EntityManager } from '@mikro-orm/postgresql';
import { DepartmentsMapper } from '../mappers/departments.mapper';

@Injectable()
export class MikroDepartmentsRepository implements IDepartmentsRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async create(department: Department): Promise<void> {
    this.entityManager.persist(DepartmentsMapper.toMikro(department));

    await this.entityManager.flush();
  }
}
