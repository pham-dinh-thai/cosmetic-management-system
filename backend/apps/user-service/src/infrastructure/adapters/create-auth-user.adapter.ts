import { Injectable } from '@nestjs/common';
import {
  ICreateAuthUserPort,
  ICreateAuthUserRequest,
} from '../../application/ports/create-auth-user.port';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateAuthUserAdapter implements ICreateAuthUserPort {
  public constructor(private readonly config: ConfigService) {}

  public async execute(request: ICreateAuthUserRequest): Promise<void> {
    const url = this.config.get('AUTH_SERVICE_URL');

    const response = await fetch(`${url}/api/internal/auth-users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create auth user: ${response.status} ${response.statusText}`,
      );
    }
  }
}
