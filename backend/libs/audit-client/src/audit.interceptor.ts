import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request } from 'express';
import { AuditAction } from './audit-action.enum';
import { AUDIT_KEY, AuditOptions } from './audit.decorator';
import { AuditLogger } from './audit-logger';

const METHOD_DEFAULTS: Record<
  string,
  { action: AuditAction; includeResponse: boolean }
> = {
  POST: { action: AuditAction.CREATE, includeResponse: true },
  PUT: { action: AuditAction.UPDATE, includeResponse: false },
  PATCH: { action: AuditAction.UPDATE, includeResponse: false },
  DELETE: { action: AuditAction.DELETE, includeResponse: false },
};

/** Rút status code từ exception (HttpException/Error/...). */
function errorStatus(error: unknown): number {
  if (typeof error === 'object' && error !== null) {
    const candidate = error as {
      getStatus?: () => unknown;
      status?: unknown;
      statusCode?: unknown;
    };

    const fromMethod = candidate.getStatus ? candidate.getStatus() : undefined;
    if (typeof fromMethod === 'number') {
      return fromMethod;
    }

    if (typeof candidate.status === 'number') {
      return candidate.status;
    }
    if (typeof candidate.statusCode === 'number') {
      return candidate.statusCode;
    }
  }

  return 500;
}

/** Rút message đọc được từ exception. */
function errorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const candidate = error as {
      getResponse?: () => unknown;
      message?: unknown;
    };

    const response = candidate.getResponse
      ? candidate.getResponse()
      : undefined;
    if (typeof response === 'string') {
      return response;
    }
    if (typeof response === 'object' && response !== null) {
      const message = (response as Record<string, unknown>).message;
      if (typeof message === 'string') {
        return message;
      }
      if (Array.isArray(message)) {
        return (message as unknown[]).join(', ');
      }
    }

    if (typeof candidate.message === 'string') {
      return candidate.message;
    }
  }

  return 'Lỗi không xác định';
}

/** Che các field nhạy cảm (password, secret, token) trước khi lưu payload vào log. */
function redactSensitiveFields(value: unknown): unknown {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return value;
  }

  const record = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(record)) {
    result[key] = /password|secret|token/i.test(key)
      ? '<redacted>'
      : redactSensitiveFields(record[key]);
  }
  return result;
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  public constructor(
    private readonly reflector: Reflector,
    private readonly auditLogger: AuditLogger,
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const options = this.reflector.getAllAndOverride<AuditOptions>(AUDIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!options) {
      return next.handle();
    }

    const request = context
      .switchToHttp()
      .getRequest<
        Request & { user?: { sub?: string; email?: string; username?: string } }
      >();
    const user = request.user;
    const methodDefault = METHOD_DEFAULTS[request.method];
    const defaults =
      methodDefault !== undefined
        ? methodDefault
        : { action: AuditAction.OTHER, includeResponse: false };

    return next.handle().pipe(
      tap({
        next: (response) => {
          const actorName =
            user?.email !== undefined ? user.email : user?.username;
          void this.auditLogger.record({
            actorId:
              options.actorId !== undefined
                ? options.actorId(request)
                : user?.sub,
            actorName,
            action:
              options.action !== undefined ? options.action : defaults.action,
            entityType: options.entityType,
            entityId: options.entityId?.(request, response),
            after:
              defaults.includeResponse &&
              typeof response === 'object' &&
              response !== null
                ? (response as Record<string, unknown>)
                : undefined,
          });
        },
        error: (error) => {
          if (options.recordOnError === false) {
            return;
          }

          const actorName =
            user?.email !== undefined ? user.email : user?.username;
          const body = (request as { body?: unknown }).body;

          void this.auditLogger.record({
            actorId:
              options.actorId !== undefined
                ? options.actorId(request)
                : user?.sub,
            actorName,
            action: AuditAction.OTHER,
            entityType: options.entityType,
            entityId: options.entityId?.(request, undefined),
            metadata: (() => {
              const meta: Record<string, unknown> = {
                failed: true,
                statusCode: errorStatus(error),
                message: errorMessage(error),
                attemptedAction:
                  options.action !== undefined
                    ? options.action
                    : defaults.action,
              };
              if (
                typeof body === 'object' &&
                body !== null &&
                !Array.isArray(body)
              ) {
                meta.payload = redactSensitiveFields(body);
              }
              return meta;
            })(),
          });
        },
      }),
    );
  }
}
