import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard, OrgGuard, Role, Roles } from '@app/security';
import { FindAllAuditLogsUseCase } from 'apps/audit-service/src/application/use-cases/find-all-audit-logs/find-all-audit-logs.use-case';
import { FindAuditLogByIdUseCase } from 'apps/audit-service/src/application/use-cases/find-audit-log-by-id/find-audit-log-by-id.use-case';
import { AuditLogDetailReadModel } from 'apps/audit-service/src/application/use-cases/find-audit-log-by-id/read-models/audit-log-detail.read-model';
import { FindAllAuditLogsQuery } from './requests/audit-log.requests';

@UseGuards(AuthGuard, OrgGuard)
@Roles(Role.Admin)
@Controller('audit-logs')
export class AuditLogsController {
  public constructor(
    private readonly findAllAuditLogsUseCase: FindAllAuditLogsUseCase,
    private readonly findAuditLogByIdUseCase: FindAuditLogByIdUseCase,
  ) {}

  @Get()
  public async findAll(@Query() query: FindAllAuditLogsQuery) {
    return await this.findAllAuditLogsUseCase.execute({
      search: query.search,
      action: query.action,
      entityType: query.entityType,
      entityId: query.entityId,
      actorId: query.actorId,
      fromDate: query.fromDate,
      toDate: query.toDate,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<AuditLogDetailReadModel> {
    return await this.findAuditLogByIdUseCase.execute(id);
  }
}
