import { Employee } from '../employee.aggregate';

export interface IEmployeesRepository {
  findById(id: string): Promise<Employee | null>;

  create(employee: Employee): Promise<void>;

  updateInformation(employee: Employee): Promise<void>;
}

export const EMPLOYEES_REPOSITORY = 'IEmployeesRepository';
