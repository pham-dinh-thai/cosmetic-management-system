import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ICreateUserPort,
  ICreateUserRequest,
} from '../../application/use-cases/create-customer/ports/create-user.port';

export class CreateUserAdapter implements ICreateUserPort {
  private readonly logger = new Logger(CreateUserAdapter.name);
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('USER_SERVICE_URL');
  }

  public async execute(request: ICreateUserRequest): Promise<{ id: string }> {
    const response = await fetch(`${this.url}/api/internal/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      this.logger.error(
        `Failed to create user: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );

      if (response.status >= 400 && response.status < 500) {
        let message = 'Failed to create user';
        try {
          const parsed = JSON.parse(body) as { message?: string | string[] };
          if (Array.isArray(parsed.message)) {
            message = parsed.message.join(', ');
          } else if (parsed.message) {
            message = parsed.message;
          }
        } catch {
          // ignore invalid body
        }
        throw new BadRequestException(message);
      }

      throw new InternalServerErrorException('Failed to create user');
    }

    const body: unknown = await response.json();

    return body as { id: string };
  }
}
