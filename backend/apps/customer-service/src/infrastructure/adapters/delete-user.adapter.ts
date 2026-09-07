import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDeleteUserPort } from '../../application/use-cases/create-customer/ports/delete-user.port';

export class DeleteUserAdapter implements IDeleteUserPort {
  private readonly logger = new Logger(DeleteUserAdapter.name);
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
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
