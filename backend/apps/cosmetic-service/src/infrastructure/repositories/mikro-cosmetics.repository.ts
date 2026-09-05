import { Injectable } from '@nestjs/common';
import {
  CreateVariantData,
  ICosmeticsRepository,
  UpdateVariantData,
} from '../../domain/repositories/cosmetics.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { Cosmetic as CosmeticMikro } from '../entities/cosmetic.entity';
import { CosmeticVariant as CosmeticVariantMikro } from '../entities/cosmetic-variant.entity';
import { CosmeticCategory as CosmeticCategoryMikro } from '../entities/cosmetic-category.entity';
import { CosmeticsMapper } from '../mappers/cosmetics.mapper';
import { Cosmetic } from '../../domain/cosmetic.aggregate';

@Injectable()
export class MikroCosmeticsRepository implements ICosmeticsRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(search?: string): Promise<Cosmetic[]> {
    const where: Record<string, unknown> = { isActive: true };

    if (search) {
      where.$or = [
        { name: { $ilike: `%${search}%` } },
        { code: { $ilike: `%${search}%` } },
        { brand: { $ilike: `%${search}%` } },
      ];
    }

    const cosmeticsMikro = await this.entityManager.find(CosmeticMikro, where, {
      orderBy: { createdAt: 'DESC' },
      populate: ['variants', 'categories'],
    });

    return cosmeticsMikro.map((cosmeticMikro) =>
      CosmeticsMapper.toDomain(cosmeticMikro),
    );
  }

  public async findById(id: string): Promise<Cosmetic | null> {
    const cosmeticMikro = await this.entityManager.findOne(
      CosmeticMikro,
      { id },
      { populate: ['variants', 'categories'] },
    );

    return cosmeticMikro ? CosmeticsMapper.toDomain(cosmeticMikro) : null;
  }

  public async count(): Promise<number> {
    return await this.entityManager.count(CosmeticMikro);
  }

  public async create(cosmetic: Cosmetic): Promise<{ id: string }> {
    const cosmeticMikro = new CosmeticMikro();

    cosmeticMikro.code = cosmetic.getCode();
    cosmeticMikro.name = cosmetic.getName();
    cosmeticMikro.brand = cosmetic.getBrand();
    cosmeticMikro.origin = cosmetic.getOrigin();
    cosmeticMikro.description = cosmetic.getDescription();
    cosmeticMikro.imageUrl = cosmetic.getImageUrl();

    this.entityManager.persist(cosmeticMikro);

    for (const variant of cosmetic.getVariants()) {
      const variantMikro = new CosmeticVariantMikro();

      variantMikro.cosmetic = cosmeticMikro;
      variantMikro.name = variant.getName();
      variantMikro.color = variant.getColor();
      variantMikro.volume = variant.getVolume();
      variantMikro.price = variant.getPrice();
      variantMikro.costPrice = variant.getCostPrice();

      this.entityManager.persist(variantMikro);
    }

    for (const categoryId of cosmetic.getCategoryIds()) {
      const categoryMikro = new CosmeticCategoryMikro();

      categoryMikro.cosmetic = cosmeticMikro;
      categoryMikro.categoryId = categoryId;

      this.entityManager.persist(categoryMikro);
    }

    await this.entityManager.flush();

    return { id: cosmeticMikro.id };
  }

  public async update(
    id: string,
    data: {
      name: string;
      brand: string | null;
      origin: string | null;
      description: string | null;
      imageUrl: string | null;
    },
  ): Promise<Cosmetic | null> {
    const cosmeticMikro = await this.entityManager.findOne(
      CosmeticMikro,
      {
        id,
      },
      { populate: ['variants', 'categories'] },
    );

    if (!cosmeticMikro) {
      return null;
    }

    cosmeticMikro.name = data.name;
    cosmeticMikro.brand = data.brand;
    cosmeticMikro.origin = data.origin;
    cosmeticMikro.description = data.description;
    cosmeticMikro.imageUrl = data.imageUrl;

    await this.entityManager.flush();

    return CosmeticsMapper.toDomain(cosmeticMikro);
  }

  public async activate(id: string): Promise<Cosmetic | null> {
    const cosmeticMikro = await this.entityManager.findOne(
      CosmeticMikro,
      {
        id,
      },
      { populate: ['variants', 'categories'] },
    );

    if (!cosmeticMikro) {
      return null;
    }

    cosmeticMikro.isActive = true;
    await this.entityManager.flush();

    return CosmeticsMapper.toDomain(cosmeticMikro);
  }

  public async deactivate(id: string): Promise<Cosmetic | null> {
    const cosmeticMikro = await this.entityManager.findOne(
      CosmeticMikro,
      {
        id,
      },
      { populate: ['variants', 'categories'] },
    );

    if (!cosmeticMikro) {
      return null;
    }

    cosmeticMikro.isActive = false;
    await this.entityManager.flush();

    return CosmeticsMapper.toDomain(cosmeticMikro);
  }

  public async delete(id: string): Promise<Cosmetic | null> {
    const cosmeticMikro = await this.entityManager.findOne(
      CosmeticMikro,
      {
        id,
      },
      { populate: ['variants', 'categories'] },
    );

    if (!cosmeticMikro) {
      return null;
    }

    const cosmetic = CosmeticsMapper.toDomain(cosmeticMikro);

    this.entityManager.remove(cosmeticMikro);
    await this.entityManager.flush();

    return cosmetic;
  }

  public async addVariant(
    cosmeticId: string,
    variant: CreateVariantData,
  ): Promise<{ id: string }> {
    const variantMikro = new CosmeticVariantMikro();

    variantMikro.cosmetic = this.entityManager.getReference(
      CosmeticMikro,
      cosmeticId,
    );
    variantMikro.name = variant.name;
    variantMikro.color = variant.color;
    variantMikro.volume = variant.volume;
    variantMikro.price = variant.price;
    variantMikro.costPrice = variant.costPrice;

    this.entityManager.persist(variantMikro);
    await this.entityManager.flush();

    return { id: variantMikro.id };
  }

  public async updateVariant(
    variantId: string,
    variant: UpdateVariantData,
  ): Promise<{ id: string } | null> {
    const variantMikro = await this.entityManager.findOne(
      CosmeticVariantMikro,
      { id: variantId },
    );

    if (!variantMikro) {
      return null;
    }

    variantMikro.name = variant.name;
    variantMikro.color = variant.color;
    variantMikro.volume = variant.volume;
    variantMikro.price = variant.price;
    variantMikro.costPrice = variant.costPrice;

    await this.entityManager.flush();

    return { id: variantMikro.id };
  }

  public async activateVariant(
    variantId: string,
  ): Promise<{ id: string } | null> {
    const variantMikro = await this.entityManager.findOne(
      CosmeticVariantMikro,
      { id: variantId },
    );

    if (!variantMikro) {
      return null;
    }

    variantMikro.isActive = true;
    await this.entityManager.flush();

    return { id: variantMikro.id };
  }

  public async deactivateVariant(
    variantId: string,
  ): Promise<{ id: string } | null> {
    const variantMikro = await this.entityManager.findOne(
      CosmeticVariantMikro,
      { id: variantId },
    );

    if (!variantMikro) {
      return null;
    }

    variantMikro.isActive = false;
    await this.entityManager.flush();

    return { id: variantMikro.id };
  }

  public async findVariantById(
    variantId: string,
  ): Promise<{ id: string; name: string; price: number } | null> {
    const variantMikro = await this.entityManager.findOne(
      CosmeticVariantMikro,
      { id: variantId },
    );

    if (!variantMikro) {
      return null;
    }

    return {
      id: variantMikro.id,
      name: variantMikro.name,
      price: Number(variantMikro.price),
    };
  }
}
