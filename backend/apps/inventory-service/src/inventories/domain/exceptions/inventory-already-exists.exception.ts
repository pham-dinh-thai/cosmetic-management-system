import { BaseDomainException } from 'apps/inventory-service/src/shared/exceptions/base-domain-exception';

export class InventoryAlreadyExistsException extends BaseDomainException {
  public readonly statusCode = 409;
  public readonly code = 'INVENTORY_ALREADY_EXISTS';

  public constructor(variantId: string) {
    super(`Kho cho variant "${variantId}" đã tồn tại`);
  }
}
