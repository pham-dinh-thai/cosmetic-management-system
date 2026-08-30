import { UserNotFoundException } from 'apps/user-service/src/domain/exceptions/user-not-found.exception';
import { IUsersRepository } from 'apps/user-service/src/domain/repositories/users.repository';

export class DeactivateUserUseCase {
  public constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException(id);
    }

    user.deactivate();

    await this.usersRepository.updateActiveStatus(user);
  }
}

export const deactivateUserUseCaseFactory = (
  usersRepository: IUsersRepository,
) => new DeactivateUserUseCase(usersRepository);
