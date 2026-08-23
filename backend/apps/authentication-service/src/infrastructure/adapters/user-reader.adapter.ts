import { Injectable } from '@nestjs/common';
import { IUserReaderPort } from '../../domain/ports/user-reader.port';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserReaderAdapter implements IUserReaderPort {
  private readonly baseUrl: string;

  public constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>('USER_SERVICE_URL')!;
  }

  public async findById(id: string): Promise<{ id: string } | null> {
    const response = await fetch(
      `${this.baseUrl}/api/users/internal/by-id/${id}`,
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `User service returned ${response.status}: ${response.statusText}`,
      );
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
  }

  public async findByEmail(
    email: string,
  ): Promise<{ id: string; roleId: string } | null> {
    const response = await fetch(
      `${this.baseUrl}/api/users/internal/by-email/${email}`,
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `User service returned ${response.status}: ${response.statusText}`,
      );
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
  }
}
