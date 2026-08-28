import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IFindUserInformationPort } from '../../application/use-cases/update-employee-information/ports/find-user-information.port';
import { ConfigService } from '@nestjs/config';

export class FindUserInformationAdapter implements IFindUserInformationPort {
  private readonly logger = new Logger(FindUserInformationAdapter.name);
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
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
