import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Invoice as InvoiceDomain } from '../../domain/invoice.aggregate';
import { InvoiceStatus } from '../../domain/types';
import { InvoicesRepository } from '../../domain/repositories/invoices.repository';
import { Invoice } from '../entities/invoice.entity';
import { InvoiceMapper } from '../mappers/invoice.mapper';

@Injectable()
export class MikroInvoicesRepository implements InvoicesRepository {
  private readonly em: EntityManager;

  public constructor(em: EntityManager) {
    this.em = em;
  }

  public async findAll(options?: {
    search?: string;
    status?: InvoiceStatus;
    orderId?: string;
    customerId?: string;
  }): Promise<InvoiceDomain[]> {
    const where: Record<string, unknown> = {};

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.search) {
      where.code = { $ilike: `%${options.search}%` };
    }

    if (options?.orderId) {
      where.orderId = options.orderId;
    }

    if (options?.customerId) {
      where.customerId = options.customerId;
    }

    const entities = await this.em.find(Invoice, where, {
      orderBy: { createdAt: 'DESC' },
    });

    return entities.map((entity) => InvoiceMapper.toDomain(entity));
  }

  public async findById(id: string): Promise<InvoiceDomain | null> {
    const entity = await this.em.findOne(Invoice, { id });

    return entity ? InvoiceMapper.toDomain(entity) : null;
  }

  public async findByOrderId(orderId: string): Promise<InvoiceDomain | null> {
    const entity = await this.em.findOne(Invoice, { orderId });

    return entity ? InvoiceMapper.toDomain(entity) : null;
  }

  public async count(): Promise<number> {
    return this.em.count(Invoice);
  }

  public async create(invoice: InvoiceDomain): Promise<{ id: string }> {
    const entity = this.em.create(Invoice, {
      code: invoice.getCode(),
      orderId: invoice.getOrderId(),
      customerId: invoice.getCustomerId(),
      totalAmount: invoice.getTotalAmount(),
      paidAmount: invoice.getPaidAmount(),
      status: invoice.getStatus(),
      note: invoice.getNote() ?? null,
    });

    await this.em.flush();

    return { id: entity.id };
  }

  public async recordPayment(
    id: string,
    amount: number,
  ): Promise<InvoiceDomain | null> {
    const entity = await this.em.findOne(Invoice, { id });

    if (!entity) {
      return null;
    }

    const invoice = InvoiceMapper.toDomain(entity);
    invoice.applyPayment(amount);

    entity.paidAmount = invoice.getPaidAmount();
    entity.status = invoice.getStatus();
    await this.em.flush();

    return InvoiceMapper.toDomain(entity);
  }

  public async updateNote(
    id: string,
    note?: string,
  ): Promise<InvoiceDomain | null> {
    const entity = await this.em.findOne(Invoice, { id });

    if (!entity) {
      return null;
    }

    entity.note = note ?? null;
    await this.em.flush();

    return InvoiceMapper.toDomain(entity);
  }

  public async delete(id: string): Promise<InvoiceDomain | null> {
    const entity = await this.em.findOne(Invoice, { id });

    if (!entity) {
      return null;
    }

    await this.em.remove(entity).flush();

    return InvoiceMapper.toDomain(entity);
  }
}
