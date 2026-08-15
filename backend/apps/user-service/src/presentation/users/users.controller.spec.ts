import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id/find-user-by-id.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';

jest.mock(
  '../../application/use-cases/find-user-by-id/find-user-by-id.use-case',
  () => ({
    FindUserByIdUseCase: class FindUserByIdUseCaseMock {},
  }),
);
jest.mock(
  '../../application/use-cases/create-user/create-user.use-case',
  () => ({
    CreateUserUseCase: class CreateUserUseCaseMock {},
  }),
);

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: FindUserByIdUseCase, useValue: {} },
        { provide: CreateUserUseCase, useValue: {} },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
