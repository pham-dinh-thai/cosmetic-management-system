import { Injectable } from '@nestjs/common';
import { ICategoriesRepository } from '../../domain/repositories/categories.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { Category as CategoryMikro } from '../entities/category.entity';
import { CategoriesMapper } from '../mappers/categories.mapper';
import { Category } from '../../domain/category.aggregate';

@Injectable()
export class MikroCategoriesRepository implements ICategoriesRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(search?: string): Promise<Category[]> {
    const where: Record<string, unknown> = { isActive: true };

    if (search) {
      where.name = { $ilike: `%${search}%` };
    }

    const categoriesMikro = await this.entityManager.find(
      CategoryMikro,
      where,
      { orderBy: { createdAt: 'DESC' } },
    );

    return categoriesMikro.map((categoryMikro) =>
      CategoriesMapper.toDomain(categoryMikro),
    );
  }

  public async findById(id: string): Promise<Category | null> {
    const categoryMikro = await this.entityManager.findOne(
      CategoryMikro,
      { id },
    );

    return categoryMikro ? CategoriesMapper.toDomain(categoryMikro) : null;
  }

  public async findByName(name: string): Promise<Category | null> {
    const categoryMikro = await this.entityManager.findOne(
      CategoryMikro,
      { name },
    );

    return categoryMikro ? CategoriesMapper.toDomain(categoryMikro) : null;
  }

  public async create(category: Category): Promise<{ id: string }> {
    const categoryMikro = CategoriesMapper.toMikro(category);

    this.entityManager.persist(categoryMikro);
    await this.entityManager.flush();

    return { id: categoryMikro.id };
  }

  public async update(
    id: string,
    data: { name: string; description: string | null },
  ): Promise<Category | null> {
    const categoryMikro = await this.entityManager.findOne(
      CategoryMikro,
      { id },
    );

    if (!categoryMikro) {
      return null;
    }

    categoryMikro.name = data.name;
    categoryMikro.description = data.description;

    await this.entityManager.flush();

    return CategoriesMapper.toDomain(categoryMikro);
  }

  public async activate(id: string): Promise<Category | null> {
    const categoryMikro = await this.entityManager.findOne(
      CategoryMikro,
      { id },
    );

    if (!categoryMikro) {
      return null;
    }

    categoryMikro.isActive = true;
    await this.entityManager.flush();

    return CategoriesMapper.toDomain(categoryMikro);
  }

  public async deactivate(id: string): Promise<Category | null> {
    const categoryMikro = await this.entityManager.findOne(
      CategoryMikro,
      { id },
    );

    if (!categoryMikro) {
      return null;
    }

    categoryMikro.isActive = false;
    await this.entityManager.flush();

    return CategoriesMapper.toDomain(categoryMikro);
  }

  public async delete(id: string): Promise<Category | null> {
    const categoryMikro = await this.entityManager.findOne(
      CategoryMikro,
      { id },
    );

    if (!categoryMikro) {
      return null;
    }

    const category = CategoriesMapper.toDomain(categoryMikro);

    this.entityManager.remove(categoryMikro);
    await this.entityManager.flush();

    return category;
  }
}
