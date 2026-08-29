import { type IUsersReaderPort } from '../ports/users-reader.port';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

export class EnsureUserExistsService {
  public constructor(private readonly usersReaderPort: IUsersReaderPort) {}

  public async byUserId(userId: string): Promise<void> {
    const user = await this.usersReaderPort.findById(userId);

    if (!user) {
      throw new UserNotFoundException(userId);
    }
  }
}

export const ensureUserExistsServiceFactory = (
  usersReaderPort: IUsersReaderPort,
): EnsureUserExistsService => new EnsureUserExistsService(usersReaderPort);
