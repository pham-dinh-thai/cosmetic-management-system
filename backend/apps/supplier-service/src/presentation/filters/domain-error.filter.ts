import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { BaseDomainException } from '../../domain/exceptions/base-domain-exception';

@Catch(BaseDomainException)
export class DomainErrorFilter implements ExceptionFilter {
  public catch(exception: BaseDomainException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(exception.statusCode).json({
      statusCode: exception.statusCode,
      message: exception.message,
    });
  }
}