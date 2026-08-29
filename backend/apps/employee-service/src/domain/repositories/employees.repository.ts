import { Employee } from '../employee.aggregate';

export interface IEmployeesRepository {
  findById(id: string): Promise<Employee | null>;

  create(employee: Employee): Promise<void>;

  updateInformation(employee: Employee): Promise<void>;

  delete(id: string): Promise<Employee | null>;
}

export const EMPLOYEES_REPOSITORY = 'IEmployeesRepository';
