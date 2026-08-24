import { Module } from '@nestjs/common';
import { DepartmentServiceController } from './department-service.controller';
import { DepartmentServiceService } from './department-service.service';
import { DepartmentsController } from './presentation/public/departments/departments.controller';

@Module({
  imports: [],
  controllers: [DepartmentServiceController, DepartmentsController],
  providers: [DepartmentServiceService],
})
export class DepartmentServiceModule {}
