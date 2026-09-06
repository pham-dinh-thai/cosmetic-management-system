import { Injectable } from '@nestjs/common';
import {
  FindUserByIdReadModel,
  IUsersReaderPort,
} from '../../application/ports/users-reader.port';
import { UserReadModel } from '../../domain/read-models/user.read-model';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

export const findUserByIdReadModel = z.object({
  id: z.string(),
});

@Injectable()
export class UsersReaderAdapter implements IUsersReaderPort {
  private readonly baseUrl: string;

  public constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('USER_SERVICE_URL');

    if (!url) {
      throw new Error('USER_SERVICE_URL is not configured');
    }

    this.baseUrl = url;
  }

  public async findById(id: string): Promise<FindUserByIdReadModel | null> {
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

    const data: unknown = JSON.parse(text);

    const user = findUserByIdReadModel.parse(data);

    return new FindUserByIdReadModel(user.id);
  }

  public async findByEmail(email: string): Promise<UserReadModel | null> {
    const response = await fetch(
      `${this.baseUrl}/api/internal/users/by-email/${email}`,
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
      roleId: string;
      isActive: boolean;
    };

    return new UserReadModel(data.id, data.roleId, data.isActive);
  }
}
