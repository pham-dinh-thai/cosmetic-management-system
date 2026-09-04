import { Injectable } from '@nestjs/common';
import { ISuppliersRepository } from '../../domain/repositories/suppliers.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { Supplier as SupplierMikro } from '../entities/supplier.entity';
import { SuppliersMapper } from '../mappers/suppliers.mapper';
import { Supplier } from '../../domain/supplier.aggregate';

@Injectable()
export class MikroSuppliersRepository implements ISuppliersRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(search?: string): Promise<Supplier[]> {
    const where: Record<string, unknown> = { isActive: true };

    if (search) {
      where.$or = [
        { name: { $ilike: `%${search}%` } },
        { code: { $ilike: `%${search}%` } },
        { email: { $ilike: `%${search}%` } },
      ];
    }

    const suppliersMikro = await this.entityManager.find(
      SupplierMikro,
      where,
      { orderBy: { createdAt: 'DESC' } },
    );

    return suppliersMikro.map((supplierMikro) =>
      SuppliersMapper.toDomain(supplierMikro),
    );
  }

  public async findById(id: string): Promise<Supplier | null> {
    const supplierMikro = await this.entityManager.findOne(SupplierMikro, {
      id,
    });

    return supplierMikro ? SuppliersMapper.toDomain(supplierMikro) : null;
  }

  public async findByEmail(email: string): Promise<Supplier | null> {
    const supplierMikro = await this.entityManager.findOne(SupplierMikro, {
      email,
    });

    return supplierMikro ? SuppliersMapper.toDomain(supplierMikro) : null;
  }

  public async count(): Promise<number> {
    return await this.entityManager.count(SupplierMikro);
  }

  public async create(supplier: Supplier): Promise<{ id: string }> {
    const supplierMikro = SuppliersMapper.toMikro(supplier);

    this.entityManager.persist(supplierMikro);
    await this.entityManager.flush();

    return { id: supplierMikro.id };
  }

  public async update(
    id: string,
    data: {
      name: string;
      email: string;
      phone: string | null;
      address: string | null;
    },
  ): Promise<Supplier | null> {
    const supplierMikro = await this.entityManager.findOne(SupplierMikro, {
      id,
    });

    if (!supplierMikro) {
      return null;
    }

    supplierMikro.name = data.name;
    supplierMikro.email = data.email;
    supplierMikro.phone = data.phone;
    supplierMikro.address = data.address;

    await this.entityManager.flush();

    return SuppliersMapper.toDomain(supplierMikro);
  }

  public async activate(id: string): Promise<Supplier | null> {
    const supplierMikro = await this.entityManager.findOne(SupplierMikro, {
      id,
    });

    if (!supplierMikro) {
      return null;
    }

    supplierMikro.isActive = true;
    await this.entityManager.flush();

    return SuppliersMapper.toDomain(supplierMikro);
  }

  public async deactivate(id: string): Promise<Supplier | null> {
    const supplierMikro = await this.entityManager.findOne(SupplierMikro, {
      id,
    });

    if (!supplierMikro) {
      return null;
    }

    supplierMikro.isActive = false;
    await this.entityManager.flush();

    return SuppliersMapper.toDomain(supplierMikro);
  }

  public async delete(id: string): Promise<Supplier | null> {
    const supplierMikro = await this.entityManager.findOne(SupplierMikro, {
      id,
    });

    if (!supplierMikro) {
      return null;
    }

    const supplier = SuppliersMapper.toDomain(supplierMikro);

    this.entityManager.remove(supplierMikro);
    await this.entityManager.flush();

    return supplier;
  }
}