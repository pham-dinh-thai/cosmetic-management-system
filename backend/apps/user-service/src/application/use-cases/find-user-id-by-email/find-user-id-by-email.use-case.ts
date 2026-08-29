import { FindUserIdByEmailResponse } from './find-user-id-by-email.response';
import { type IUsersRepository } from 'apps/user-service/src/domain/repositories/users.repository';

export class FindUserIdByEmailUseCase {
  public constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(
    email: string,
  ): Promise<FindUserIdByEmailResponse | null> {
    const user = await this.usersRepository.findByEmail(email);

    return user
      ? new FindUserIdByEmailResponse(user.getId(), user.getRoleId())
      : null;
  }
}

export const findUserIdByEmailUseCaseFactory = (
  usersRepository: IUsersRepository,
): FindUserIdByEmailUseCase => new FindUserIdByEmailUseCase(usersRepository);
