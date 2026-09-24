import { Injectable } from '@nestjs/common';
import {
  FindUserByIdReadModel,
  IFindUserByIdPort,
} from '../../application/ports/find-user-by-id.port';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FindUserByIdAdapter implements IFindUserByIdPort {
  private readonly baseUrl: string;

  public constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('USER_SERVICE_URL');

    if (!url) {
      throw new Error('USER_SERVICE_URL is not configured');
    }

    this.baseUrl = url;
  }

  public async execute(id: string): Promise<FindUserByIdReadModel | null> {
    const response = await fetch(
      `${this.baseUrl}/api/internal/users/by-id/${id}`,
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `User service returned ${response.status}: ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    const text = await response.text();

    if (!text) {
      return null;
    }

    const data = JSON.parse(text) as {
      id: string;
      firstName: string;
      lastName: string;
      gender: string;
      email: string;
      roleId: string;
      isActive: boolean;
    };

    return new FindUserByIdReadModel(
      data.id,
      data.firstName,
      data.lastName,
      data.gender,
      data.email,
      data.roleId,
      data.isActive,
    );
  }
}
