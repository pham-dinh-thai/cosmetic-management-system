import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { EmailAlreadyTakenException } from '../../domain/exceptions/email-already-taken.exception';

@Catch(EmailAlreadyTakenException)
export class EmailAlreadyTakenFilter implements ExceptionFilter {
  public catch(
    exception: EmailAlreadyTakenException,
    host: ArgumentsHost,
  ): void {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(409).json({
      statusCode: 409,
      message: exception.message,
      error: 'Conflict',
    });
  }
}
