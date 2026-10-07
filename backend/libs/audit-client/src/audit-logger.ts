import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecordAuditLogInput } from './audit-action.enum';
import { redactSensitiveFields } from './redact';

@Injectable()
export class AuditLogger {
  private readonly logger = new Logger(AuditLogger.name);
  private readonly url: string | undefined;
  private networkWarned = false;

  public constructor(config: ConfigService) {
    this.url = config.get<string>('AUDIT_SERVICE_URL');
  }

  /**
   * Record an audit log entry. Never throws: audit must not break the business flow.
   */
  public async record(input: RecordAuditLogInput): Promise<void> {
    if (!this.url) {
      this.logger.warn(
        'AUDIT_SERVICE_URL chưa được cấu hình, bỏ qua ghi audit',
      );
      return;
    }

    try {
      const response = await fetch(`${this.url}/api/internal/audit-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Chốt chặn duy nhất: che token/password trước khi rời khỏi service,
        // bất kể nơi nào gọi record() (interceptor hay gọi trực tiếp).
        body: JSON.stringify({
          ...input,
          before:
            input.before === undefined
              ? undefined
              : redactSensitiveFields(input.before),
          after:
            input.after === undefined
              ? undefined
              : redactSensitiveFields(input.after),
          metadata:
            input.metadata === undefined
              ? undefined
              : redactSensitiveFields(input.metadata),
        }),
      });

      if (!response.ok) {
        this.logger.error(
          `Ghi audit thất bại (status ${response.status}) - ${input.entityType}/${input.action}`,
        );
      }
    } catch {
      if (!this.networkWarned) {
        this.networkWarned = true;
        this.logger.warn(
          `Không thể gọi audit-service tại ${this.url}, bỏ qua ghi audit`,
        );
      }
    }
  }
}
