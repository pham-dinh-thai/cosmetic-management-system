import { IUpdateUserInformationRequest } from './update-user-information.request';
import { UserNotFoundException } from 'apps/user-service/src/domain/exceptions/user-not-found.exception';
import { type IUsersRepository } from 'apps/user-service/src/domain/repositories/users.repository';
import { UserUniquenessService } from 'apps/user-service/src/domain/services/user-uniqueness.service';

export class UpdateUserInformationUseCase {
  public constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly userUniquenessService: UserUniquenessService,
  ) {}

  public async execute(
    id: string,
    request: IUpdateUserInformationRequest,
  ): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException(id);
    }

    if (request.email && request.email !== user.getEmail()) {
      await this.userUniquenessService.ensureEmailIsUnique(request.email);
    }

    user.updateInformation({
      firstName: request.firstName,
      lastName: request.lastName,
      gender: request.gender,
      email: request.email,
    });

    await this.usersRepository.updateInformation(user);
  }
}

export const updateUserInformationUseCaseFactory = (
  usersRepository: IUsersRepository,
  userUniquenessService: UserUniquenessService,
): UpdateUserInformationUseCase =>
  new UpdateUserInformationUseCase(usersRepository, userUniquenessService);
