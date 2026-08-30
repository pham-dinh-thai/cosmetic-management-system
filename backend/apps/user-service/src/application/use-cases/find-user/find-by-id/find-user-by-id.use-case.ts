import { type IUsersRepository } from 'apps/user-service/src/domain/repositories/users.repository';
import { FindUserByIdReadModel } from './read-models/find-user-by-id.read-model';

export class FindUserByIdUseCase {
  public constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(id: string): Promise<FindUserByIdReadModel | null> {
    const user = await this.usersRepository.findById(id);

    return user
      ? new FindUserByIdReadModel(
          user.getId(),
          user.getFirstName(),
          user.getLastName(),
          user.getGender(),
          user.getEmail(),
          user.getRoleId(),
        )
      : null;
  }
}

export const findUserByIdUseCaseFactory = (
  usersRepository: IUsersRepository,
): FindUserByIdUseCase => new FindUserByIdUseCase(usersRepository);
