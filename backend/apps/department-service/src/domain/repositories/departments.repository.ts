import { Department } from '../department.aggregate';

export interface IDepartmentsRepository {
  findAll(): Promise<Department[]>;

  findByCode(code: string): Promise<Department | null>;

  findById(id: string): Promise<Department | null>;

  create(department: Department): Promise<void>;

  update(id: string, department: Department): Promise<void>;

  deactivate(id: string): Promise<void>;

  activate(id: string): Promise<void>;

  assignManager(department: Department): Promise<void>;
}

export const DEPARTMENTS_REPOSITORY = 'IDepartmentsRepository';
