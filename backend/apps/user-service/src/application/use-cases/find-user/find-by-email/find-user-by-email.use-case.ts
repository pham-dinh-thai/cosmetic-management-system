import { type IUsersRepository } from 'apps/user-service/src/domain/repositories/users.repository';
import { FindUserByEmailReadModel } from './read-models/find-user-by-email.read-model';

export class FindUserByEmailUseCase {
  public constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(
    email: string,
  ): Promise<FindUserByEmailReadModel | null> {
    const user = await this.usersRepository.findByEmail(email);

    return user
      ? new FindUserByEmailReadModel(
          user.getId(),
          user.getRoleId(),
          user.getIsActive(),
        )
      : null;
  }
}

export const findUserByEmailUseCaseFactory = (
  usersRepository: IUsersRepository,
): FindUserByEmailUseCase => new FindUserByEmailUseCase(usersRepository);
