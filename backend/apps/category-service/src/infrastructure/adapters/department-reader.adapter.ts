import { ConfigService } from '@nestjs/config';
import {
  type DepartmentReadable,
  type IDepartmentReaderPort,
} from '@app/security';

export class DepartmentReaderAdapter implements IDepartmentReaderPort {
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('DEPARTMENT_SERVICE_URL');
  }

  public async findById(id: string): Promise<DepartmentReadable | null> {
    const response = await fetch(`${this.url}/api/internal/departments/${id}`);

    if (!response.ok) {
      return null;
    }

    const text = await response.text();

    return text ? (JSON.parse(text) as DepartmentReadable) : null;
  }
}
