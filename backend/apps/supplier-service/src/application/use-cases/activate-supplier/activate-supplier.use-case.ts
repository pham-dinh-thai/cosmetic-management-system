import { SupplierNotFoundException } from '../../../domain/exceptions/supplier-not-found.exception';
import { type ISuppliersRepository } from '../../../domain/repositories/suppliers.repository';

export class ActivateSupplierUseCase {
  public constructor(
    private readonly suppliersRepository: ISuppliersRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const supplier = await this.suppliersRepository.activate(id);

    if (!supplier) {
      throw new SupplierNotFoundException(id);
    }
  }
}

export const activateSupplierUseCaseFactory = (
  suppliersRepository: ISuppliersRepository,
): ActivateSupplierUseCase => new ActivateSupplierUseCase(suppliersRepository);