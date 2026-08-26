import { Employee } from '../employee.aggregate';

export interface IEmployeesRepository {
  create(employee: Employee): Promise<void>;
}

export const EMPLOYEES_REPOSITORY = 'IEmployeesRepository';
