import { Supplier } from '../supplier.aggregate';

export interface ISuppliersRepository {
  findAll(search?: string, includeInactive?: boolean): Promise<Supplier[]>;

  findById(id: string): Promise<Supplier | null>;

  findByEmail(email: string): Promise<Supplier | null>;

  findMaxCodeSequence(): Promise<number | null>;

  create(supplier: Supplier): Promise<{ id: string }>;

  update(
    id: string,
    data: {
      name: string;
      email: string;
      phone: string | null;
      address: string | null;
    },
  ): Promise<Supplier | null>;

  activate(id: string): Promise<Supplier | null>;

  deactivate(id: string): Promise<Supplier | null>;

  delete(id: string): Promise<Supplier | null>;
}

export const SUPPLIERS_REPOSITORY = 'ISuppliersRepository';
