import { Module } from '@nestjs/common';
import { CustomersController } from './presentation/public/customers/customers.controller';

@Module({
  imports: [],
  controllers: [CustomersController],
  providers: [],
})
export class CustomerServiceModule {}
