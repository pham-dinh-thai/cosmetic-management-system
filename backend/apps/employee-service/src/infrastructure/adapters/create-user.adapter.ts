import { ConfigService } from '@nestjs/config';
import {
  ICreateUserPort,
  ICreateUserRequest,
} from '../../application/ports/create-user.port';

export class CreateUserAdapter implements ICreateUserPort {
  public constructor(private readonly config: ConfigService) {}

  public async execute(request: ICreateUserRequest): Promise<{ id: string }> {
    const url = this.config.get<string>('USER_SERVICE_URL');

    const response = await fetch(`${url}/api/internal/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create user: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }
}
