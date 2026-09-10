import { ConfigService } from '@nestjs/config';
import { IEmployeeCodeReaderPort } from '../../application/use-cases/print-order/ports/employee-code-reader.port';

type EmployeeData = {
  id?: string;
  code?: string;
};

export class EmployeeCodeReaderAdapter implements IEmployeeCodeReaderPort {
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('EMPLOYEE_SERVICE_URL');
  }

  public async getEmployeeCode(userId: string): Promise<string | null> {
    const response = await fetch(
      `${this.url}/api/internal/employees/by-user/${userId}`,
    );

    if (!response.ok) {
      return null;
    }

    const text = await response.text();

    if (!text) {
      return null;
    }

    const data: unknown = JSON.parse(text);

    const code = (data as EmployeeData)?.code;

    return typeof code === 'string' && code.length > 0 ? code : null;
  }
}