import { Controller, Get } from '@nestjs/common';
import { AuthorizationServiceService } from './authorization-service.service';

@Controller()
export class AuthorizationServiceController {
  constructor(private readonly authorizationServiceService: AuthorizationServiceService) {}

  @Get()
  getHello(): string {
    return this.authorizationServiceService.getHello();
  }
}
