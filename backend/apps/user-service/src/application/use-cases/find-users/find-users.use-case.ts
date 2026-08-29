import { UserReadModel } from './read-model/user.read-model';
import { type IUsersRepository } from 'apps/user-service/src/domain/repositories/users.repository';

export class FindUsersUseCase {
  public constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(): Promise<UserReadModel[]> {
    const users = await this.usersRepository.findAll();

    return users.map(
      (user) =>
        new UserReadModel(
          user.getId(),
          user.getFirstName(),
          user.getLastName(),
          user.getGender(),
          user.getEmail(),
          user.getRoleId(),
        ),
    );
  }
}

export const findUsersUseCaseFactory = (
  usersRepository: IUsersRepository,
): FindUsersUseCase => new FindUsersUseCase(usersRepository);
