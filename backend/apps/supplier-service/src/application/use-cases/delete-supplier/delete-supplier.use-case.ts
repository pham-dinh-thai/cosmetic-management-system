import { SupplierNotFoundException } from '../../../domain/exceptions/supplier-not-found.exception';
import { type ISuppliersRepository } from '../../../domain/repositories/suppliers.repository';

export class DeleteSupplierUseCase {
  public constructor(
    private readonly suppliersRepository: ISuppliersRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const deleted = await this.suppliersRepository.delete(id);

    if (!deleted) {
      throw new SupplierNotFoundException(id);
    }
  }
}

export const deleteSupplierUseCaseFactory = (
  suppliersRepository: ISuppliersRepository,
): DeleteSupplierUseCase => new DeleteSupplierUseCase(suppliersRepository);
