import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IUpdateUserInformationPort,
  IUpdateUserInformationRequest,
} from '../../application/use-cases/update-customer/ports/update-user-information.port';
import {
  IFindUserInformationPort,
  UserInformation,
} from '../../application/use-cases/update-customer/ports/find-user-information.port';

export class UpdateUserInformationAdapter implements IUpdateUserInformationPort {
  private readonly logger = new Logger(UpdateUserInformationAdapter.name);
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('USER_SERVICE_URL');
  }

  public async execute(
    id: string,
    request: IUpdateUserInformationRequest,
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
        throw new HttpException(
          this.parseMessage(body) || 'Failed to update user information',
          response.status,
        );
      }

      throw new InternalServerErrorException(
        'Failed to update user information',
      );
    }
  }

  private parseMessage(body: string): string {
    if (!body) {
      return '';
    }

    try {
      const parsed = JSON.parse(body) as { message?: unknown };

      if (Array.isArray(parsed.message)) {
        return parsed.message.filter((m) => typeof m === 'string').join(', ');
      }

      if (typeof parsed.message === 'string') {
        return parsed.message;
      }
    } catch {
      return '';
    }

    return '';
  }
}

export class FindUserInformationAdapter implements IFindUserInformationPort {
  private readonly logger = new Logger(FindUserInformationAdapter.name);
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('USER_SERVICE_URL');
  }

  public async execute(userId: string): Promise<UserInformation | null> {
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

    if (!text.trim()) {
      this.logger.warn(`User ${userId} not found`);
      return null;
    }

    return JSON.parse(text) as UserInformation;
  }
}
