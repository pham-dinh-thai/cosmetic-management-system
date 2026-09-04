import { ICreateSupplierRequest } from './create-supplier.request';
import { Supplier } from '../../../domain/supplier.aggregate';
import { DuplicateSupplierEmailException } from '../../../domain/exceptions/duplicate-supplier-email.exception';
import { type ISuppliersRepository } from '../../../domain/repositories/suppliers.repository';
import { SupplierCode } from '../../../domain/value-objects/supplier-code.value-object';

export class CreateSupplierUseCase {
  public constructor(
    private readonly suppliersRepository: ISuppliersRepository,
  ) {}

  public async execute(request: ICreateSupplierRequest): Promise<{ id: string }> {
    const existing = await this.suppliersRepository.findByEmail(request.email);

    if (existing) {
      throw new DuplicateSupplierEmailException(request.email);
    }

    const code = SupplierCode.generate(
      (await this.suppliersRepository.count()) + 1,
    );

    const supplier = Supplier.create({
      code: code.getValue(),
      name: request.name,
      email: request.email,
      phone: request.phone ?? null,
      address: request.address ?? null,
    });

    return await this.suppliersRepository.create(supplier);
  }
}

export const createSupplierUseCaseFactory = (
  suppliersRepository: ISuppliersRepository,
): CreateSupplierUseCase => new CreateSupplierUseCase(suppliersRepository);