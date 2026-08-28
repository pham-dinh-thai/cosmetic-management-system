import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ICreateUserPort,
  ICreateUserRequest,
} from '../../application/use-cases/create-employee/ports/create-user.port';
import {
  EMPLOYEE_LOGGER_PORT,
  type IEmployeeLoggerPort,
} from '../../application/ports/employee-logger.port';

export class CreateUserAdapter implements ICreateUserPort {
  private readonly logger: IEmployeeLoggerPort;
  private readonly url: string;

  public constructor(
    logger: IEmployeeLoggerPort,
    private readonly config: ConfigService,
  ) {
    this.logger = logger.createContext(CreateUserAdapter.name);
    this.url = this.config.getOrThrow<string>('USER_SERVICE_URL');
  }

  public async execute(request: ICreateUserRequest): Promise<{ id: string }> {
    const response = await fetch(`${this.url}/api/internal/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      this.logger.error(
        `Failed to create user: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );

      if (response.status >= 400 && response.status < 500) {
        throw new BadRequestException('Failed to create user');
      }

      throw new InternalServerErrorException('Failed to create user');
    }

    return response.json();
  }
}
