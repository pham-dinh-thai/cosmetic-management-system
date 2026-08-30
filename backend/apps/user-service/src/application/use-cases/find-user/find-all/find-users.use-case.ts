import { type IUsersRepository } from 'apps/user-service/src/domain/repositories/users.repository';
import { FindAllUserReadModel } from './read-models/find-all-user.read-model';

export class FindAllUserUseCase {
  public constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(): Promise<FindAllUserReadModel[]> {
    const users = await this.usersRepository.findAll();

    return users.map(
      (user) =>
        new FindAllUserReadModel(
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

export const findAllUserUseCaseFactory = (
  usersRepository: IUsersRepository,
): FindAllUserUseCase => new FindAllUserUseCase(usersRepository);
