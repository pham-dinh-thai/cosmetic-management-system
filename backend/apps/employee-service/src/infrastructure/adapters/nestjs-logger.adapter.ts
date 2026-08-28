import { Injectable, Logger } from '@nestjs/common';
import { IEmployeeLoggerPort } from '../../application/ports/employee-logger.port';

@Injectable()
export class NestJSLoggerAdapter implements IEmployeeLoggerPort {
  private readonly logger: Logger;

  public constructor(context: string = 'App') {
    this.logger = new Logger(context);
  }

  public createContext(context: string): IEmployeeLoggerPort {
    return new NestJSLoggerAdapter(context);
  }

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
