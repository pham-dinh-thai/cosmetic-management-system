import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IUpdateUserInformationPort,
  IUpdateUserInformationRequest,
} from '../../application/use-cases/update-employee-information/ports/update-user-information.port';

@Injectable()
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
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      this.logger.error(
        `Failed to update user ${id}: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );

      if (response.status >= 400 && response.status < 500) {
        throw new BadRequestException('Failed to update user information');
      }

      throw new InternalServerErrorException(
        'Failed to update user information',
      );
    }
  }
}
