import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationServiceController } from './authorization-service.controller';
import { AuthorizationServiceService } from './authorization-service.service';

describe('AuthorizationServiceController', () => {
  let authorizationServiceController: AuthorizationServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthorizationServiceController],
      providers: [AuthorizationServiceService],
    }).compile();

    authorizationServiceController = app.get<AuthorizationServiceController>(AuthorizationServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(authorizationServiceController.getHello()).toBe('Hello World!');
    });
  });
});
