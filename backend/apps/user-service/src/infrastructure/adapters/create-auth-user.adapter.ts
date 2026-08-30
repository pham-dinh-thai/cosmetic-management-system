import { Injectable } from '@nestjs/common';
import {
  ICreateAuthUserPort,
  ICreateAuthUserRequest,
} from '../../application/use-cases/create-user/ports/create-auth-user.port';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateAuthUserAdapter implements ICreateAuthUserPort {
  public constructor(private readonly config: ConfigService) {}

  public async execute(request: ICreateAuthUserRequest): Promise<void> {
    const url = this.config.get<string>('AUTH_SERVICE_URL');

    if (!url) {
      throw new Error('AUTH_SERVICE_URL is not configured');
    }

    const response = await fetch(`${url}/api/internal/auth-users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Failed to create auth user: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }
  }
}
