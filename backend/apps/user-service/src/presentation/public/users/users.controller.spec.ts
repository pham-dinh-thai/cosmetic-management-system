import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id/find-user-by-id.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';
import { FindUsersUseCase } from '../../application/use-cases/find-users/find-users.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user/delete-user.use-case';

jest.mock('../../application/use-cases/find-users/find-users.use-case', () => ({
  FindUsersUseCase: class FindUsersUseCaseMock {},
}));
jest.mock(
  '../../application/use-cases/delete-user/delete-user.use-case',
  () => ({
    DeleteUserUseCase: class DeleteUserUseCaseMock {},
  }),
);
jest.mock(
  '../../application/use-cases/create-user/create-user.use-case',
  () => ({
    CreateUserUseCase: class CreateUserUseCaseMock {},
  }),
);
jest.mock('../../application/use-cases/find-users/find-users.use-case', () => ({
  FindUsersUseCase: class FindUsersUseCaseMock {},
}));

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: FindUsersUseCase, useValue: {} },
        { provide: FindUserByIdUseCase, useValue: {} },
        { provide: CreateUserUseCase, useValue: {} },
        { provide: DeleteUserUseCase, useValue: {} },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
