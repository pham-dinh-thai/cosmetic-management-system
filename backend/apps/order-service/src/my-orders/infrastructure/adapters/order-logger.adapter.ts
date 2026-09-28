import { Logger } from '@nestjs/common';
import { IOrderLoggerPort } from '../../application/ports/order-logger.port';

export class OrderLoggerAdapter implements IOrderLoggerPort {
  private readonly logger = new Logger('OrderService');

  public warn(message: string, ...context: unknown[]): void {
    this.logger.warn(message, ...context);
  }

  public error(message: string, ...context: unknown[]): void {
    this.logger.error(message, ...context);
  }

  public log(message: string, ...context: unknown[]): void {
    this.logger.log(message, ...context);
  }
}
