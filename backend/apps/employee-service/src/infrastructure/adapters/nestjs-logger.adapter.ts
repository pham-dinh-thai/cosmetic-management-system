import { Injectable, Logger } from '@nestjs/common';
import { IEmployeeLoggerPort } from '../../application/ports/employee-logger.port';

@Injectable()
export class NestJSLoggerAdapter implements IEmployeeLoggerPort {
  private readonly logger = new Logger('App');

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
