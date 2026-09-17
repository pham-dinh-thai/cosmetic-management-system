import { Payment as PaymentDomain } from '../../domain/payment.aggregate';
import { Payment as PaymentEntity } from '../entities/payment.entity';

export class PaymentMapper {
  public static toDomain(entity: PaymentEntity): PaymentDomain {
    return PaymentDomain.fromPersistent({
      id: entity.id,
      code: entity.code,
      amount: entity.amount,
      category: entity.category,
      source: entity.source,
      purchaseOrderId: entity.purchaseOrderId ?? undefined,
      supplierId: entity.supplierId ?? undefined,
      note: entity.note ?? undefined,
      employeeId: entity.employeeId ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}