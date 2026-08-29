import { type IAuthUsersCommandRepository } from '../../../domain/repositories/auth-users-command.repository';

export class DeleteAuthUserUseCase {
  public constructor(
    private readonly authUsersCommandRepository: IAuthUsersCommandRepository,
  ) {}

  public async execute(userId: string): Promise<void> {
    await this.authUsersCommandRepository.deleteByUserId(userId);
  }
}

export const deleteAuthUserUseCaseFactory = (
  authUsersCommandRepository: IAuthUsersCommandRepository,
): DeleteAuthUserUseCase =>
  new DeleteAuthUserUseCase(authUsersCommandRepository);
