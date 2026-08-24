import { Department } from '../department.aggregate';

export interface IDepartmentsRepository {
  create(department: Department): Promise<void>;
}

export const DEPARTMENTS_REPOSITORY = 'IDepartmentsRepository';
