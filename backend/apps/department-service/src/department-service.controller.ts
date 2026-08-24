import { Controller, Get } from '@nestjs/common';
import { DepartmentServiceService } from './department-service.service';

@Controller()
export class DepartmentServiceController {
  constructor(private readonly departmentServiceService: DepartmentServiceService) {}

  @Get()
  getHello(): string {
    return this.departmentServiceService.getHello();
  }
}
