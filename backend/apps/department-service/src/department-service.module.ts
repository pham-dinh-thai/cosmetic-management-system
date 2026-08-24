import { Module } from '@nestjs/common';
import { DepartmentServiceController } from './department-service.controller';
import { DepartmentServiceService } from './department-service.service';

@Module({
  imports: [],
  controllers: [DepartmentServiceController],
  providers: [DepartmentServiceService],
})
export class DepartmentServiceModule {}
