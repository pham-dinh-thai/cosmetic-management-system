import { ICreateUserRequest } from './create-user.request';
import { User } from '../../../domain/user.aggregate';
import { UserUniquenessService } from '../../../domain/services/user-uniqueness.service';
import { type IUsersRepository } from 'apps/user-service/src/domain/repositories/users.repository';
import { type ICreateAuthUserPort } from './ports/create-auth-user.port';

export class CreateUserUseCase {
  public constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly createAuthUserPort: ICreateAuthUserPort,
    private readonly userUniquenessService: UserUniquenessService,
  ) {}

  public async execute(request: ICreateUserRequest): Promise<{ id: string }> {
    await this.userUniquenessService.ensureEmailIsUnique(request.email);

    const user = User.create({
      firstName: request.firstName,
      lastName: request.lastName,
      gender: request.gender,
      email: request.email,
      roleId: request.roleId,
    });

    const created = await this.usersRepository.create(user);

    await this.createAuthUserPort.execute({
      userId: created.id,
      password: request.password,
    });

    return { id: created.id };
  }
}

export const createUserUseCaseFactory = (
  usersRepository: IUsersRepository,
  createAuthUserPort: ICreateAuthUserPort,
  userUniquenessService: UserUniquenessService,
): CreateUserUseCase =>
  new CreateUserUseCase(
    usersRepository,
    createAuthUserPort,
    userUniquenessService,
  );
