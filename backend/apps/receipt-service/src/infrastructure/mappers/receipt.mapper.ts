import { Receipt as ReceiptDomain } from '../../domain/receipt.aggregate';
import { Receipt as ReceiptEntity } from '../entities/receipt.entity';

export class ReceiptMapper {
  public static toDomain(entity: ReceiptEntity): ReceiptDomain {
    return ReceiptDomain.fromPersistent({
      id: entity.id,
      code: entity.code,
      amount: entity.amount,
      source: entity.source,
      invoiceId: entity.invoiceId ?? undefined,
      customerId: entity.customerId ?? undefined,
      note: entity.note ?? undefined,
      employeeId: entity.employeeId ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}