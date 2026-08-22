import { Module } from '@nestjs/common';
import { AuthorizationServiceController } from './authorization-service.controller';
import { AuthorizationServiceService } from './authorization-service.service';
import { RolesController } from './presentation/roles/roles.controller';

@Module({
  imports: [],
  controllers: [AuthorizationServiceController, RolesController],
  providers: [AuthorizationServiceService],
})
export class AuthorizationServiceModule {}
