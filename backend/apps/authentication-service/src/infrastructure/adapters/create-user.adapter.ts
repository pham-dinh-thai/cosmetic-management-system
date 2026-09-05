import { Injectable } from '@nestjs/common';
import {
  ICreateUserPort,
  ICreateUserPortRequest,
} from '../../application/ports/create-user.port';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateUserAdapter implements ICreateUserPort {
  public constructor(private readonly config: ConfigService) {}

  public async execute(
    request: ICreateUserPortRequest,
  ): Promise<{ id: string }> {
    const url = this.config.get<string>('USER_SERVICE_URL');

    if (!url) {
      throw new Error('USER_SERVICE_URL is not configured');
    }

    const response = await fetch(`${url}/api/internal/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Failed to create user: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    return (await response.json()) as { id: string };
  }
}
