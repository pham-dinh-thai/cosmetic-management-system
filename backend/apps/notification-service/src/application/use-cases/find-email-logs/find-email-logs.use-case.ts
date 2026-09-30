import { EmailLog, EmailLogStatus } from '../../../domain/email-log';
import { IEmailLogsRepository } from '../../../domain/repositories/email-logs.repository';

export class FindEmailLogsUseCase {
  public constructor(
    private readonly emailLogsRepository: IEmailLogsRepository,
  ) {}

  public async execute(orderId?: string): Promise<EmailLog[]> {
    return await this.emailLogsRepository.findMany(orderId);
  }
}

export class EmailLogReadModel {
  public constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly eventType: string,
    public readonly recipient: string,
    public readonly subject: string,
    public readonly status: EmailLogStatus,
    public readonly providerId: string | null,
    public readonly error: string | null,
    public readonly createdAt: string,
  ) {}
}

export const findEmailLogsUseCaseFactory = (
  emailLogsRepository: IEmailLogsRepository,
): FindEmailLogsUseCase => new FindEmailLogsUseCase(emailLogsRepository);
