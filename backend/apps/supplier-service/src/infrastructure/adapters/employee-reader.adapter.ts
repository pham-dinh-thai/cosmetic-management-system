import { ConfigService } from '@nestjs/config';
import { type EmployeeReadable, type IEmployeeReaderPort } from '@app/security';

export class EmployeeReaderAdapter implements IEmployeeReaderPort {
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('EMPLOYEE_SERVICE_URL');
  }

  public async findByUserId(userId: string): Promise<EmployeeReadable | null> {
    const response = await fetch(
      `${this.url}/api/internal/employees/by-user/${userId}`,
    );

    if (!response.ok) {
      return null;
    }

    const text = await response.text();

    return text ? (JSON.parse(text) as EmployeeReadable) : null;
  }
}
