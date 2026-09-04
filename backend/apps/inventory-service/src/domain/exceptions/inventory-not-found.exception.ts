import { BaseDomainException } from './base-domain-exception';

export class InventoryNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;
  public readonly code = 'INVENTORY_NOT_FOUND';

  public constructor(idOrVariantId: string) {
    super(`Inventory for variant "${idOrVariantId}" was not found`);
  }
}
