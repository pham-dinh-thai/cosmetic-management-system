import { type IUsersReaderPort } from '../ports/users-reader.port';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists.exception';

export class EmailUniquenessService {
  public constructor(private readonly usersReaderPort: IUsersReaderPort) {}

  public async ensureEmailIsUnique(email: string): Promise<void> {
    const user = await this.usersReaderPort.findByEmail(email);

    if (user?.id) {
      throw new EmailAlreadyExistsException(email);
    }
  }
}

export const emailUniquenessServiceFactory = (
  usersReaderPort: IUsersReaderPort,
): EmailUniquenessService => new EmailUniquenessService(usersReaderPort);
