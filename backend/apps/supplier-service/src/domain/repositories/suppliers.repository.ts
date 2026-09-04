import { Supplier } from '../supplier.aggregate';

export interface ISuppliersRepository {
  findAll(search?: string): Promise<Supplier[]>;
  findById(id: string): Promise<Supplier | null>;
  findByEmail(email: string): Promise<Supplier | null>;
  count(): Promise<number>;
  create(supplier: Supplier): Promise<{ id: string }>;
  update(
    id: string,
    data: { name: string; email: string; phone: string | null; address: string | null },
  ): Promise<Supplier | null>;
  activate(id: string): Promise<Supplier | null>;
  deactivate(id: string): Promise<Supplier | null>;
  delete(id: string): Promise<Supplier | null>;
}

export const SUPPLIERS_REPOSITORY = 'ISuppliersRepository';