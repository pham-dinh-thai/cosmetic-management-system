import { UserNotFoundException } from 'apps/user-service/src/domain/exceptions/user-not-found.exception';
import { type IUsersRepository } from 'apps/user-service/src/domain/repositories/users.repository';
import { type IDeleteAuthUserPort } from '../../ports/delete-auth-user.port';

export class DeleteUserUseCase {
  public constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly deleteAuthUserPort: IDeleteAuthUserPort,
  ) {}

  public async execute(id: string): Promise<void> {
    const deletedUser = await this.usersRepository.delete(id);

    if (!deletedUser) {
      throw new UserNotFoundException(id);
    }

    try {
      await this.deleteAuthUserPort.execute(id);
    } catch (error) {
      await this.usersRepository.create(deletedUser);
      throw error;
    }
  }
}

export const deleteUserUseCaseFactory = (
  usersRepository: IUsersRepository,
  deleteAuthUserPort: IDeleteAuthUserPort,
): DeleteUserUseCase =>
  new DeleteUserUseCase(usersRepository, deleteAuthUserPort);
