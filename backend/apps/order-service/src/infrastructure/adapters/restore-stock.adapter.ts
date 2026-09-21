import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IRestoreStockPort } from '../../domain/ports/restore-stock.port';

export class RestoreStockAdapter implements IRestoreStockPort {
  private readonly logger = new Logger(RestoreStockAdapter.name);
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('INVENTORY_SERVICE_URL');
  }

  public async execute(variantId: string, quantity: number): Promise<void> {
    const response = await fetch(
      `${this.url}/api/internal/inventories/restore`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, quantity }),
      },
    );

    if (!response.ok) {
      this.logger.error(
        `Failed to restore inventory for variant ${variantId} (status ${response.status})`,
      );
      throw new InternalServerErrorException('Không thể hoàn kho cho đơn hàng');
    }
  }
}
