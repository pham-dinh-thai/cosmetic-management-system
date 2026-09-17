import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Payment as PaymentDomain } from '../../domain/payment.aggregate';
import { PaymentCategory, PaymentSource } from '../../domain/types';
import { PaymentsRepository } from '../../domain/repositories/payments.repository';
import { Payment } from '../entities/payment.entity';
import { PaymentMapper } from '../mappers/payment.mapper';
import { PAYMENT_CODE_PREFIX } from '../../domain/value-objects/payment-code.value-object';
import { maxSequenceFromCodes } from '@app/codes';

@Injectable()
export class MikroPaymentsRepository implements PaymentsRepository {
  private readonly em: EntityManager;

  public constructor(em: EntityManager) {
    this.em = em;
  }

  public async findAll(options?: {
    search?: string;
    category?: PaymentCategory;
    source?: PaymentSource;
    purchaseOrderId?: string;
    supplierId?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<PaymentDomain[]> {
    const where: Record<string, unknown> = {};

    if (options?.category) {
      where.category = options.category;
    }

    if (options?.source) {
      where.source = options.source;
    }

    if (options?.purchaseOrderId) {
      where.purchaseOrderId = options.purchaseOrderId;
    }

    if (options?.supplierId) {
      where.supplierId = options.supplierId;
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

    const entities = await this.em.find(Payment, where, {
      orderBy: { createdAt: 'DESC' },
    });

    return entities.map((entity) => PaymentMapper.toDomain(entity));
  }

  public async findById(id: string): Promise<PaymentDomain | null> {
    const entity = await this.em.findOne(Payment, { id });

    return entity ? PaymentMapper.toDomain(entity) : null;
  }

  public async findByPurchaseOrderId(
    purchaseOrderId: string,
  ): Promise<PaymentDomain | null> {
    const entity = await this.em.findOne(Payment, { purchaseOrderId });

    return entity ? PaymentMapper.toDomain(entity) : null;
  }

  public async findMaxCodeSequence(): Promise<number | null> {
    const entities = await this.em.find(
      Payment,
      {},
      { fields: ['code'], orderBy: { code: 'DESC' }, limit: 1 },
    );

    if (entities.length === 0) {
      return null;
    }

    return maxSequenceFromCodes(PAYMENT_CODE_PREFIX, [entities[0].code]);
  }

  public async create(payment: PaymentDomain): Promise<{ id: string }> {
    const entity = this.em.create(Payment, {
      code: payment.getCode(),
      amount: payment.getAmount(),
      category: payment.getCategory(),
      source: payment.getSource(),
      purchaseOrderId: payment.getPurchaseOrderId() ?? null,
      supplierId: payment.getSupplierId() ?? null,
      note: payment.getNote() ?? null,
      employeeId: payment.getEmployeeId() ?? null,
    });

    await this.em.flush();

    return { id: entity.id };
  }

  public async updateNote(
    id: string,
    note?: string,
  ): Promise<PaymentDomain | null> {
    const entity = await this.em.findOne(Payment, { id });

    if (!entity) {
      return null;
    }

    entity.note = note ?? null;
    await this.em.flush();

    return PaymentMapper.toDomain(entity);
  }

  public async delete(id: string): Promise<PaymentDomain | null> {
    const entity = await this.em.findOne(Payment, { id });

    if (!entity) {
      return null;
    }

    await this.em.remove(entity).flush();

    return PaymentMapper.toDomain(entity);
  }
}