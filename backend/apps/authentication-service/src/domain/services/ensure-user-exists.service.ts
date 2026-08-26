import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IUsersReaderPort,
  USERS_READER_PORT,
} from '../ports/users-reader.port';

@Injectable()
export class EnsureUserExistsService {
  public constructor(
    @Inject(USERS_READER_PORT)
    private readonly usersReaderPort: IUsersReaderPort,
  ) {}

  public async byUserId(userId: string): Promise<void> {
    const user = await this.usersReaderPort.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  }
}
