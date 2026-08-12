import { Module } from '@nestjs/common';
import { AuthenticationServiceController } from './authentication-service.controller';
import { AuthenticationServiceService } from './authentication-service.service';

@Module({
  imports: [],
  controllers: [AuthenticationServiceController],
  providers: [AuthenticationServiceService],
})
export class AuthenticationServiceModule {}
