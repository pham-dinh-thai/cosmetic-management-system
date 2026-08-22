import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorizationServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
