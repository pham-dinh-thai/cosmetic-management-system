import { ConfigService } from '@nestjs/config';
import { IDeleteUserPort } from '../../application/use-cases/delete-employee/ports/delete-user.port';
import {
  EMPLOYEE_LOGGER_PORT,
  type IEmployeeLoggerPort,
} from '../../application/ports/employee-logger.port';

export class DeleteUserAdapter implements IDeleteUserPort {
  private readonly logger: IEmployeeLoggerPort;
  private readonly url: string;

  public constructor(
    logger: IEmployeeLoggerPort,
    private readonly config: ConfigService,
  ) {
    this.logger = logger.createContext(DeleteUserAdapter.name);
    this.url = this.config.getOrThrow<string>('USER_SERVICE_URL');
  }

  public async execute(userId: string): Promise<boolean> {
    const response = await fetch(`${this.url}/api/internal/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      this.logger.error(
        `Failed to delete user ${userId}: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );

      return false;
    }

    return true;
  }
}
