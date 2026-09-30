import { Controller, Get, Query } from '@nestjs/common';
import {
  EmailLogReadModel,
  FindEmailLogsUseCase,
} from '../../../application/use-cases/find-email-logs/find-email-logs.use-case';

@Controller('internal/email-logs')
export class InternalEmailLogsController {
  public constructor(private readonly findEmailLogs: FindEmailLogsUseCase) {}

  @Get()
  public async findAll(
    @Query('orderId') orderId?: string,
  ): Promise<EmailLogReadModel[]> {
    const logs = await this.findEmailLogs.execute(orderId);

    return logs.map(
      (log) =>
        new EmailLogReadModel(
          log.id,
          log.orderId,
          log.eventType,
          log.recipient,
          log.subject,
          log.status,
          log.providerId,
          log.error,
          log.createdAt.toISOString(),
        ),
    );
  }
}
