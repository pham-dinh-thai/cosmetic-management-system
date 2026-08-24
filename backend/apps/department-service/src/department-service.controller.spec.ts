import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentServiceController } from './department-service.controller';
import { DepartmentServiceService } from './department-service.service';

describe('DepartmentServiceController', () => {
  let departmentServiceController: DepartmentServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentServiceController],
      providers: [DepartmentServiceService],
    }).compile();

    departmentServiceController = app.get<DepartmentServiceController>(DepartmentServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(departmentServiceController.getHello()).toBe('Hello World!');
    });
  });
});
