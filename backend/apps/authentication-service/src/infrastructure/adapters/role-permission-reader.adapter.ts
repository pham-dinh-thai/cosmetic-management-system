import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IRolePermissionReaderPort } from '../../application/ports/role-permission-reader.port';

@Injectable()
export class RolePermissionReaderAdapter implements IRolePermissionReaderPort {
  private readonly baseUrl: string;

  public constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('AUTHORIZATION_SERVICE_URL');

    if (!url) {
      throw new Error('AUTHORIZATION_SERVICE_URL is not configured');
    }

    this.baseUrl = url;
  }

  public async findByRoleId(roleId: string): Promise<string[]> {
    if (!roleId) {
      return [];
    }

    const response = await fetch(
      `${this.baseUrl}/api/internal/roles/${encodeURIComponent(roleId)}`,
    );

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      return [];
    }

    const text = await response.text();

    if (!text) {
      return [];
    }

    const data = JSON.parse(text) as {
      isActive: boolean;
      permissions: Array<{ id: string; isActive: boolean }>;
    };

    if (!data.isActive) {
      return [];
    }

    return data.permissions
      .filter((permission) => permission.isActive)
      .map((permission) => permission.id);
  }
}