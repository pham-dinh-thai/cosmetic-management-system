import { BaseDomainException } from './base-domain-exception';

export class AuditLogNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;
  public readonly code = 'AUDIT_LOG_NOT_FOUND';

  public constructor(id: string) {
    super(`Nhật ký kiểm toán "${id}" không tồn tại`);
  }
}
