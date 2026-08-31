import { Injectable } from '@nestjs/common';
import {
  FindEmployeeByIdReadModel,
  IEmployeeReaderPort,
} from '../../application/use-cases/assign-manager-to-department/ports/employee-reader.port';
import { ConfigService } from '@nestjs/config';
import { EmployeeStatus } from '../../domain/employee/enums/employee-status.enum';
import { Position } from '../../domain/employee/enums/position.enum';

@Injectable()
export class EmployeeReaderAdapter implements IEmployeeReaderPort {
  private readonly baseUrl: string;

  public constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('EMPLOYEE_SERVICE_URL');

    if (!url) {
      throw new Error('EMPLOYEE_SERVICE_URL is not configured');
    }

    this.baseUrl = url;
  }

  public async findById(id: string): Promise<FindEmployeeByIdReadModel | null> {
    const response = await fetch(
      `${this.baseUrl}/api/internal/employees/${id}`,
    );

    if (response.status === 404 || response.status === 400) {
      return null;
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Employee service returned ${response.status}: ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    const text = await response.text();

    if (!text) {
      return null;
    }

    const data = JSON.parse(text);

    return new FindEmployeeByIdReadModel(
      data.id,
      data.userId,
      data.code,
      data.departmentId,
      data.hiredAt,
      data.status as EmployeeStatus,
      data.position as Position,
      data.phone,
      data.address,
    );
  }
}
