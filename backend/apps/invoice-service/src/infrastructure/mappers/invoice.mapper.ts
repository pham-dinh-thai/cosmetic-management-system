import { Invoice as InvoiceDomain } from '../../domain/invoice.aggregate';
import { Invoice as InvoiceEntity } from '../entities/invoice.entity';

export class InvoiceMapper {
  public static toDomain(entity: InvoiceEntity): InvoiceDomain {
    return InvoiceDomain.fromPersistent({
      id: entity.id,
      code: entity.code,
      orderId: entity.orderId,
      customerId: entity.customerId,
      totalAmount: entity.totalAmount,
      paidAmount: entity.paidAmount,
      status: entity.status,
      note: entity.note ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
