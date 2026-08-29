import { type IUsersRepository } from '../repositories/users.repository';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists.exception';

export class UserUniquenessService {
  public constructor(private readonly usersRepository: IUsersRepository) {}

  public async ensureEmailIsUnique(email: string): Promise<void> {
    if (await this.usersRepository.findByEmail(email)) {
      throw new EmailAlreadyExistsException(email);
    }
  }
}
