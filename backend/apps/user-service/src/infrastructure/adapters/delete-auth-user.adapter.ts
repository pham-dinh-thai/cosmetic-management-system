import { Injectable } from '@nestjs/common';
import { IDeleteAuthUserPort } from '../../application/use-cases/delete-user/ports/delete-auth-user.port';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeleteAuthUserAdapter implements IDeleteAuthUserPort {
  public constructor(private readonly config: ConfigService) {}

  public async execute(userId: string): Promise<void> {
    const url = this.config.get<string>('AUTH_SERVICE_URL');

    if (!url) {
      throw new Error('AUTH_SERVICE_URL is not configured');
    }

    const response = await fetch(
      `${url}/api/internal/auth-users/by-user-id/${userId}`,
      { method: 'DELETE' },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Failed to delete auth user ${userId}: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }
  }
}
