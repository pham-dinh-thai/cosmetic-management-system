import { BaseDomainException } from 'apps/inventory-service/src/shared/exceptions/base-domain-exception';

export class InventoryNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;
  public readonly code = 'INVENTORY_NOT_FOUND';

  public constructor(key: string, value: any) {
    super(`Kho ${key} "${value}" không tồn tại`);
  }
}
