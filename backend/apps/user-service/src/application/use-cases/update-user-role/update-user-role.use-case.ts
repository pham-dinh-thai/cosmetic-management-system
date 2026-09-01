import { IUsersRepository } from 'apps/user-service/src/domain/repositories/users.repository';
import { IUpdateUserRoleRequest } from './update-user-role.request';
import { UserNotFoundException } from 'apps/user-service/src/domain/exceptions/user-not-found.exception';
import { IRoleReaderPort } from '../../ports/role-reader.port';
import { RoleNotFoundException } from 'apps/user-service/src/domain/exceptions/role-not-found.exception';

export class UpdateUserRoleUseCase {
  public constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly roleReaderPort: IRoleReaderPort,
  ) {}

  public async execute(
    id: string,
    request: IUpdateUserRoleRequest,
  ): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException(id);
    }

    const role = await this.roleReaderPort.findById(request.roleId);

    if (!role) {
      throw new RoleNotFoundException(request.roleId);
    }

    user.updateRole(role.id);

    await this.usersRepository.updateRole(user);
  }
}

export const updateUserRoleUseCaseFactory = (
  usersRepository: IUsersRepository,
  roleReaderPort: IRoleReaderPort,
) => new UpdateUserRoleUseCase(usersRepository, roleReaderPort);
