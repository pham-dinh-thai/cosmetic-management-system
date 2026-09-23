import { AuditLogNotFoundException } from '../../../domain/exceptions/audit-log-not-found.exception';
import { AuditLogsRepository } from '../../../domain/repositories/audit-logs.repository';
import { AuditLogDetailReadModel } from './read-models/audit-log-detail.read-model';

export class FindAuditLogByIdUseCase {
  public constructor(
    private readonly auditLogsRepository: AuditLogsRepository,
  ) {}

  public async execute(id: string): Promise<AuditLogDetailReadModel> {
    const auditLog = await this.auditLogsRepository.findById(id);

    if (!auditLog) {
      throw new AuditLogNotFoundException(id);
    }

    return AuditLogDetailReadModel.from(auditLog);
  }
}

export const findAuditLogByIdUseCaseFactory = (
  auditLogsRepository: AuditLogsRepository,
): FindAuditLogByIdUseCase => new FindAuditLogByIdUseCase(auditLogsRepository);
