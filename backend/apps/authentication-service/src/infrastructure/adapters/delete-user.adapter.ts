import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDeleteUserPort } from '../../application/use-cases/register/ports/delete-user.port';

@Injectable()
export class DeleteUserAdapter implements IDeleteUserPort {
  public constructor(private readonly config: ConfigService) {}

  public async execute(userId: string): Promise<boolean> {
    const url = this.config.get<string>('USER_SERVICE_URL');

    if (!url) {
      throw new Error('USER_SERVICE_URL is not configured');
    }

    const response = await fetch(`${url}/api/internal/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok && response.status !== 404) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Failed to delete user: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    return true;
  }
}
