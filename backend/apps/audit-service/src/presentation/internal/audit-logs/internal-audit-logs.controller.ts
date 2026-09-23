import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { RecordAuditLogUseCase } from 'apps/audit-service/src/application/use-cases/record-audit-log/record-audit-log.use-case';
import { RecordAuditLogRequest } from './requests/internal-audit-log.request';

@Controller('internal/audit-logs')
export class InternalAuditLogsController {
  public constructor(
    private readonly recordAuditLogUseCase: RecordAuditLogUseCase,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async record(
    @Body() request: RecordAuditLogRequest,
    @Req() req: Request,
  ): Promise<{ id: string }> {
    return await this.recordAuditLogUseCase.execute({
      actorId: request.actorId,
      actorName: request.actorName,
      action: request.action,
      entityType: request.entityType,
      entityId: request.entityId,
      before: request.before,
      after: request.after,
      metadata: request.metadata,
      ipAddress: request.ipAddress !== undefined ? request.ipAddress : req.ip,
      userAgent:
        request.userAgent !== undefined
          ? request.userAgent
          : req.headers['user-agent'],
    });
  }
}
