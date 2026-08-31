import { BaseDomainException } from './base-domain-exception';

export class InvalidEmployeeCodeException extends BaseDomainException {
  public readonly statusCode = 400;

  public constructor(code: string) {
    super(`Invalid employee code: ${code}`);
  }
}
