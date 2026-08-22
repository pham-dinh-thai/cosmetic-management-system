import { Module } from '@nestjs/common';
import { AuthorizationServiceController } from './authorization-service.controller';
import { AuthorizationServiceService } from './authorization-service.service';

@Module({
  imports: [],
  controllers: [AuthorizationServiceController],
  providers: [AuthorizationServiceService],
})
export class AuthorizationServiceModule {}
