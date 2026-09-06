import { Employee } from '../employee.aggregate';

export interface IEmployeesRepository {
  findAll(): Promise<Employee[]>;

  findById(id: string): Promise<Employee | null>;

  findByUserId(userId: string): Promise<Employee | null>;

  findMaxCodeSequence(): Promise<number | null>;

  create(employee: Employee): Promise<void>;

  updateInformation(employee: Employee): Promise<void>;

  delete(id: string): Promise<Employee | null>;

  assignDepartment(employee: Employee): Promise<void>;

  updatePosition(employee: Employee): Promise<void>;
}

export const EMPLOYEES_REPOSITORY = 'IEmployeesRepository';
