import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EmployeePermissionReadable,
  IEmployeePermissionReaderPort,
} from '../../application/ports/employee-permission-reader.port';
import { Position } from '@app/security';

@Injectable()
export class EmployeePermissionReaderAdapter implements IEmployeePermissionReaderPort {
  private readonly baseUrl: string;

  public constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('EMPLOYEE_SERVICE_URL');

    if (!url) {
      throw new Error('EMPLOYEE_SERVICE_URL is not configured');
    }

    this.baseUrl = url;
  }

  public async findByUserId(
    userId: string,
  ): Promise<EmployeePermissionReadable | null> {
    const response = await fetch(
      `${this.baseUrl}/api/internal/employees/by-user/${userId}`,
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
      departmentId: string;
      position: Position;
      status: string;
    };

    return {
      departmentId: data.departmentId,
      position: data.position,
      status: data.status,
    };
  }
}
