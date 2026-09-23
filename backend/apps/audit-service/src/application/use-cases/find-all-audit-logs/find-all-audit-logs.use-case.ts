import { AuditAction } from '../../../domain/types';
import { AuditLogsRepository } from '../../../domain/repositories/audit-logs.repository';
import { AuditLogReadModel } from './read-models/audit-log.read-model';

export type FindAllAuditLogsResult = {
  items: AuditLogReadModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export class FindAllAuditLogsUseCase {
  public constructor(
    private readonly auditLogsRepository: AuditLogsRepository,
  ) {}

  public async execute(
    options: {
      search?: string;
      action?: AuditAction;
      entityType?: string;
      entityId?: string;
      actorId?: string;
      fromDate?: string;
      toDate?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<FindAllAuditLogsResult> {
    const page = options.page !== undefined ? options.page : 1;
    const limit = options.limit !== undefined ? options.limit : 20;

    const { items, total } = await this.auditLogsRepository.findAll({
      search: options.search,
      action: options.action,
      entityType: options.entityType,
      entityId: options.entityId,
      actorId: options.actorId,
      fromDate: options.fromDate ? new Date(options.fromDate) : undefined,
      toDate: options.toDate ? new Date(options.toDate) : undefined,
      page,
      limit,
    });

    return {
      items: items.map((auditLog) => AuditLogReadModel.from(auditLog)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const findAllAuditLogsUseCaseFactory = (
  auditLogsRepository: AuditLogsRepository,
): FindAllAuditLogsUseCase => new FindAllAuditLogsUseCase(auditLogsRepository);
