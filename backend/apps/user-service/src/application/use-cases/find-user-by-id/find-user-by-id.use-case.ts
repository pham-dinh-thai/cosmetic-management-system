import { FindUserByIdResponse } from './find-user-by-id.response';
import { type IUsersRepository } from 'apps/user-service/src/domain/repositories/users.repository';

export class FindUserByIdUseCase {
  public constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(id: string): Promise<FindUserByIdResponse | null> {
    const user = await this.usersRepository.findById(id);

    return user
      ? new FindUserByIdResponse(
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
