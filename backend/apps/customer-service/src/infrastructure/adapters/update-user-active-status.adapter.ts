import { BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUpdateUserActiveStatusPort } from '../../application/use-cases/update-customer/ports/update-user-active-status.port';

export class UpdateUserActiveStatusAdapter
  implements IUpdateUserActiveStatusPort
{
  private readonly logger = new Logger(UpdateUserActiveStatusAdapter.name);
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('USER_SERVICE_URL');
  }

  public async deactivate(userId: string): Promise<void> {
    await this.update(userId, 'deactivate');
  }

  public async activate(userId: string): Promise<void> {
    await this.update(userId, 'activate');
  }

  private async update(
    userId: string,
    action: 'activate' | 'deactivate',
  ): Promise<void> {
    const response = await fetch(
      `${this.url}/api/internal/users/${userId}/${action}`,
      { method: 'PATCH' },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      this.logger.error(
        `Failed to ${action} user ${userId}: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );

      if (response.status >= 400 && response.status < 500) {
        throw new BadRequestException(
          `Failed to ${action} user account`,
        );
      }

      throw new Error(`Failed to ${action} user account`);
    }
  }
}