import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IFindUserInformationPort } from '../../application/use-cases/update-employee-information/ports/find-user-information.port';
import { ConfigService } from '@nestjs/config';
import {
  EMPLOYEE_LOGGER_PORT,
  type IEmployeeLoggerPort,
} from '../../application/ports/employee-logger.port';

export class FindUserInformationAdapter implements IFindUserInformationPort {
  private readonly logger: IEmployeeLoggerPort;
  private readonly url: string;

  public constructor(
    logger: IEmployeeLoggerPort,
    private readonly config: ConfigService,
  ) {
    this.logger = logger.createContext(FindUserInformationAdapter.name);
    this.url = this.config.getOrThrow<string>('USER_SERVICE_URL');
  }

  public async execute(userId: string): Promise<{
    firstName: string;
    lastName: string;
    gender: string;
  }> {
    const response = await fetch(`${this.url}/api/internal/users/${userId}`);

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      this.logger.error(
        `Failed to find user ${userId}: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );

      if (response.status >= 400 && response.status < 500) {
        throw new BadRequestException('Failed to find user information');
      }

      throw new InternalServerErrorException('Failed to find user information');
    }

    const text = await response.text();

    return JSON.parse(text);
  }
}
