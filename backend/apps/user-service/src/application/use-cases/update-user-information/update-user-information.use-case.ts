import { IUpdateUserInformationRequest } from './update-user-information.request';
import { UserNotFoundException } from 'apps/user-service/src/domain/exceptions/user-not-found.exception';
import { type IUsersRepository } from 'apps/user-service/src/domain/repositories/users.repository';

export class UpdateUserInformationUseCase {
  public constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(
    id: string,
    request: IUpdateUserInformationRequest,
  ): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException(id);
    }

    user.updateInformation({
      firstName: request.firstName,
      lastName: request.lastName,
      gender: request.gender,
    });

    await this.usersRepository.updateInformation(user);
  }
}

export const updateUserInformationUseCaseFactory = (
  usersRepository: IUsersRepository,
): UpdateUserInformationUseCase =>
  new UpdateUserInformationUseCase(usersRepository);
