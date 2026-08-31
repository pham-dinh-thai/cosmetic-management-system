import { Employee } from '../employee.aggregate';

export interface IEmployeesRepository {
  findById(id: string): Promise<Employee | null>;

  count(): Promise<number>;

  create(employee: Employee): Promise<void>;

  updateInformation(employee: Employee): Promise<void>;

  delete(id: string): Promise<Employee | null>;

  assignDepartment(employee: Employee): Promise<void>;

  updatePosition(employee: Employee): Promise<void>;
}

export const EMPLOYEES_REPOSITORY = 'IEmployeesRepository';
