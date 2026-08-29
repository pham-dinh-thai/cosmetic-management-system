import { Injectable } from '@nestjs/common';
import {
  IRoleReaderPort,
  RoleReadModel,
} from '../../application/ports/role-reader.port';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoleReaderAdapter implements IRoleReaderPort {
  private readonly baseUrl: string;

  public constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('AUTHORIZATION_SERVICE_URL');

    if (!url) {
      throw new Error('AUTHORIZATION_SERVICE_URL is not configured');
    }

    this.baseUrl = url;
  }

  public async findById(id: string): Promise<RoleReadModel | null> {
    const response = await fetch(`${this.baseUrl}/api/internal/roles/${id}`);

    if (response.status === 404 || response.status === 400) {
      return null;
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Role service returned ${response.status}: ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    const text = await response.text();

    if (!text) {
      return null;
    }

    const data = JSON.parse(text);

    return new RoleReadModel(data.id, data.name);
  }
}
