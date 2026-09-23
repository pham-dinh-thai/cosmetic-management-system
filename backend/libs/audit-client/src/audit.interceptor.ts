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
import {
  AUDIT_KEY,
  AuditOptions,
} from './audit.decorator';
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
      tap((response) => {
        const actorName =
          user?.email !== undefined ? user.email : user?.username;
        this.auditLogger.record({
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
      }),
    );
  }
}