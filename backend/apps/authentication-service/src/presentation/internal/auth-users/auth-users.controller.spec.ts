import { Test, TestingModule } from '@nestjs/testing';
import { InternalAuthUsersController } from './auth-users.controller';

describe('AuthUsersController', () => {
  let controller: InternalAuthUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternalAuthUsersController],
    }).compile();

    controller = module.get<InternalAuthUsersController>(
      InternalAuthUsersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
