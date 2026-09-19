import { ConfigService } from '@nestjs/config';
import { IDepartmentManagerPort } from '../../application/ports/department-manager.port';

export class DepartmentManagerAdapter implements IDepartmentManagerPort {
  private readonly baseUrl: string;

  public constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('DEPARTMENT_SERVICE_URL');

    if (!url) {
      throw new Error('DEPARTMENT_SERVICE_URL is not configured');
    }

    this.baseUrl = url;
  }

  public async unassignManager(employeeId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/api/internal/departments/unassign-manager`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId }),
      },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Department service returned ${response.status} while unassigning manager ${employeeId}${body ? ` - ${body}` : ''}`,
      );
    }
  }
}