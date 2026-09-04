import { Supplier } from '../../domain/supplier.aggregate';
import { Supplier as SupplierMikro } from '../entities/supplier.entity';

export class SuppliersMapper {
  public static toDomain(supplierMikro: SupplierMikro): Supplier {
    return Supplier.fromPersistent({
      id: supplierMikro.id,
      code: supplierMikro.code,
      name: supplierMikro.name,
      email: supplierMikro.email,
      phone: supplierMikro.phone ?? null,
      address: supplierMikro.address ?? null,
      isActive: supplierMikro.isActive,
      createdAt: supplierMikro.createdAt,
      updatedAt: supplierMikro.updatedAt,
    });
  }

  public static toMikro(supplier: Supplier): SupplierMikro {
    const supplierMikro = new SupplierMikro();

    supplierMikro.code = supplier.getCode();
    supplierMikro.name = supplier.getName();
    supplierMikro.email = supplier.getEmail();
    supplierMikro.phone = supplier.getPhone();
    supplierMikro.address = supplier.getAddress();

    return supplierMikro;
  }
}
