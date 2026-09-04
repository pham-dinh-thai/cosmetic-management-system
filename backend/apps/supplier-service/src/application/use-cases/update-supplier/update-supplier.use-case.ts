import { SupplierNotFoundException } from '../../../domain/exceptions/supplier-not-found.exception';
import { DuplicateSupplierEmailException } from '../../../domain/exceptions/duplicate-supplier-email.exception';
import { type ISuppliersRepository } from '../../../domain/repositories/suppliers.repository';

export class UpdateSupplierUseCase {
  public constructor(
    private readonly suppliersRepository: ISuppliersRepository,
  ) {}

  public async execute(
    id: string,
    data: { name: string; email: string; phone?: string; address?: string },
  ): Promise<void> {
    const existing = await this.suppliersRepository.findById(id);

    if (!existing) {
      throw new SupplierNotFoundException(id);
    }

    if (data.email !== existing.getEmail()) {
      const duplicate = await this.suppliersRepository.findByEmail(data.email);

      if (duplicate) {
        throw new DuplicateSupplierEmailException(data.email);
      }
    }

    await this.suppliersRepository.update(id, {
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      address: data.address ?? null,
    });
  }
}

export const updateSupplierUseCaseFactory = (
  suppliersRepository: ISuppliersRepository,
): UpdateSupplierUseCase => new UpdateSupplierUseCase(suppliersRepository);
