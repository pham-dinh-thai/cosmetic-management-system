import { Department } from '../department.aggregate';
import { DepartmentReadModel } from '../read-models/department.read-model';

export interface IDepartmentsRepository {
  findAll(): Promise<DepartmentReadModel[]>;

  findByCode(code: string): Promise<DepartmentReadModel | null>;

  create(department: Department): Promise<void>;
}

export const DEPARTMENTS_REPOSITORY = 'IDepartmentsRepository';
