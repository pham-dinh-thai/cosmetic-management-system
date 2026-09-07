import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUpdateUserInformationPort } from '../../application/use-cases/update-customer/ports/update-user-information.port';
import { IFindUserInformationPort } from '../../application/use-cases/update-customer/ports/find-user-information.port';

export class UpdateUserInformationAdapter implements IUpdateUserInformationPort {
  private readonly logger = new Logger(UpdateUserInformationAdapter.name);
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('USER_SERVICE_URL');
  }

  public async execute(
    id: string,
    request: {
      firstName: string;
      lastName: string;
      gender: string;
    },
  ): Promise<void> {
    const response = await fetch(`${this.url}/api/internal/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      this.logger.error(
        `Failed to update user ${id}: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );

      if (response.status >= 400 && response.status < 500) {
        throw new BadRequestException('Failed to update user information');
      }

      throw new InternalServerErrorException(
        'Failed to update user information',
      );
    }
  }
}

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
    email?: string;
  }> {
    const response = await fetch(
      `${this.url}/api/internal/users/by-id/${userId}`,
    );

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
    const body: unknown = JSON.parse(text);

    return body as {
      firstName: string;
      lastName: string;
      gender: string;
      email?: string;
    };
  }
}
