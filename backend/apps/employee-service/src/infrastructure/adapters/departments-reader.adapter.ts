import { ConfigService } from '@nestjs/config';
import { IDepartmentsReaderPort } from '../../application/ports/departments-reader.port';

export class DepartmentsReaderAdapter implements IDepartmentsReaderPort {
  private readonly baseUrl: string;

  public constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('DEPARTMENT_SERVICE_URL');

    if (!url) {
      throw new Error('DEPARTMENT_SERVICE_URL is not configured');
    }

    this.baseUrl = url;
  }

  public async findById(id: string): Promise<{ id: string } | null> {
    const response = await fetch(
      `${this.baseUrl}/api/internal/departments/${id}`,
    );

    if (response.status === 404 || response.status === 400) {
      return null;
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Department service returned ${response.status}: ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }
}
