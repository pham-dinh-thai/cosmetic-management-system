import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IUserReaderPort,
  USER_READER_PORT,
} from '../ports/user-reader.port';

@Injectable()
export class EnsureUserExistsService {
  public constructor(
    @Inject(USER_READER_PORT)
    private readonly userReaderPort: IUserReaderPort,
  ) {}

  public async byUserId(userId: string): Promise<void> {
    const user = await this.userReaderPort.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  }
}
