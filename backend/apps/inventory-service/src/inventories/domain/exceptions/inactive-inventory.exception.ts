import { BaseDomainException } from './base-domain-exception';

export class InactiveInventoryException extends BaseDomainException {
  public readonly statusCode = 404;
  public readonly code = 'INACTIVE_INVENTORY';

  public constructor(id: string) {
    super(`Kho id: ${id} đang ngừng hoạt động`);
  }
}
