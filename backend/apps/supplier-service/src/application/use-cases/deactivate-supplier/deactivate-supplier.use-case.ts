import { SupplierNotFoundException } from '../../../domain/exceptions/supplier-not-found.exception';
import { type ISuppliersRepository } from '../../../domain/repositories/suppliers.repository';

export class DeactivateSupplierUseCase {
  public constructor(
    private readonly suppliersRepository: ISuppliersRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const supplier = await this.suppliersRepository.findById(id);

    if (!supplier) {
      throw new SupplierNotFoundException(id);
    }

    supplier.deactivate();

    await this.suppliersRepository.setIsActive(supplier);
  }
}

export const deactivateSupplierUseCaseFactory = (
  suppliersRepository: ISuppliersRepository,
): DeactivateSupplierUseCase =>
  new DeactivateSupplierUseCase(suppliersRepository);
