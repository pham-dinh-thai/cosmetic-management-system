import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Receipt as ReceiptDomain } from '../../domain/receipt.aggregate';
import { ReceiptSource } from '../../domain/types';
import { ReceiptsRepository } from '../../domain/repositories/receipts.repository';
import { Receipt } from '../entities/receipt.entity';
import { ReceiptMapper } from '../mappers/receipt.mapper';
import { RECEIPT_CODE_PREFIX } from '../../domain/value-objects/receipt-code.value-object';
import { maxSequenceFromCodes } from '@app/codes';

@Injectable()
export class MikroReceiptsRepository implements ReceiptsRepository {
  private readonly em: EntityManager;

  public constructor(em: EntityManager) {
    this.em = em;
  }

  public async findAll(options?: {
    search?: string;
    source?: ReceiptSource;
    invoiceId?: string;
    customerId?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<ReceiptDomain[]> {
    const where: Record<string, unknown> = {};

    if (options?.source) {
      where.source = options.source;
    }

    if (options?.invoiceId) {
      where.invoiceId = options.invoiceId;
    }

    if (options?.customerId) {
      where.customerId = options.customerId;
    }

    if (options?.search) {
      where.code = { $ilike: `%${options.search}%` };
    }

    if (options?.fromDate || options?.toDate) {
      where.createdAt = {
        ...(options?.fromDate ? { $gte: options.fromDate } : {}),
        ...(options?.toDate ? { $lte: options.toDate } : {}),
      };
    }

    const entities = await this.em.find(Receipt, where, {
      orderBy: { createdAt: 'DESC' },
    });

    return entities.map((entity) => ReceiptMapper.toDomain(entity));
  }

  public async findById(id: string): Promise<ReceiptDomain | null> {
    const entity = await this.em.findOne(Receipt, { id });

    return entity ? ReceiptMapper.toDomain(entity) : null;
  }

  public async findByInvoiceId(
    invoiceId: string,
  ): Promise<ReceiptDomain | null> {
    const entity = await this.em.findOne(Receipt, { invoiceId });

    return entity ? ReceiptMapper.toDomain(entity) : null;
  }

  public async findMaxCodeSequence(): Promise<number | null> {
    const entities = await this.em.find(
      Receipt,
      {},
      { fields: ['code'], orderBy: { code: 'DESC' }, limit: 1 },
    );

    if (entities.length === 0) {
      return null;
    }

    return maxSequenceFromCodes(RECEIPT_CODE_PREFIX, [entities[0].code]);
  }

  public async create(receipt: ReceiptDomain): Promise<{ id: string }> {
    const entity = this.em.create(Receipt, {
      code: receipt.getCode(),
      amount: receipt.getAmount(),
      source: receipt.getSource(),
      invoiceId: receipt.getInvoiceId() ?? null,
      customerId: receipt.getCustomerId() ?? null,
      note: receipt.getNote() ?? null,
      employeeId: receipt.getEmployeeId() ?? null,
    });

    await this.em.flush();

    return { id: entity.id };
  }

  public async updateNote(
    id: string,
    note?: string,
  ): Promise<ReceiptDomain | null> {
    const entity = await this.em.findOne(Receipt, { id });

    if (!entity) {
      return null;
    }

    entity.note = note ?? null;
    await this.em.flush();

    return ReceiptMapper.toDomain(entity);
  }

  public async delete(id: string): Promise<ReceiptDomain | null> {
    const entity = await this.em.findOne(Receipt, { id });

    if (!entity) {
      return null;
    }

    await this.em.remove(entity).flush();

    return ReceiptMapper.toDomain(entity);
  }
}