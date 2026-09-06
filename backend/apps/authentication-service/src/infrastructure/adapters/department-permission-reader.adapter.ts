import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DepartmentPermissionReadable,
  IDepartmentPermissionReaderPort,
} from '../../application/ports/department-permission-reader.port';

@Injectable()
export class DepartmentPermissionReaderAdapter implements IDepartmentPermissionReaderPort {
  private readonly baseUrl: string;

  public constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('DEPARTMENT_SERVICE_URL');

    if (!url) {
      throw new Error('DEPARTMENT_SERVICE_URL is not configured');
    }

    this.baseUrl = url;
  }

  public async findById(
    id: string,
  ): Promise<DepartmentPermissionReadable | null> {
    const response = await fetch(
      `${this.baseUrl}/api/internal/departments/${id}`,
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const text = await response.text();

    if (!text) {
      return null;
    }

    const data = JSON.parse(text) as {
      code: string;
      isActive: boolean;
    };

    return {
      code: data.code,
      isActive: data.isActive,
    };
  }
}
