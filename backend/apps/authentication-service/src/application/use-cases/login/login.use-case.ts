import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  type IUserReaderPort,
  USER_READER_PORT,
} from '../../../domain/ports/user-reader.port';
import {
  type IPasswordHasherPort,
  PASSWORD_HASHER_PORT,
} from '../../ports/password-hasher.port';
import {
  AUTH_USERS_QUERY_REPOSITORY,
  type IAuthUsersQueryRepository,
} from '../../../domain/repositories/auth-users-query.repository';
import { ILoginRequest } from './login.request';
import {
  type ISignTokenPort,
  SIGN_TOKEN_PORT,
} from '../../ports/sign-token.port';
import { LoginResponse } from './login.response';

@Injectable()
export class LoginUseCase {
  public constructor(
    @Inject(USER_READER_PORT)
    private readonly userReaderPort: IUserReaderPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasherPort: IPasswordHasherPort,

    @Inject(AUTH_USERS_QUERY_REPOSITORY)
    private readonly authUsersQueryRepository: IAuthUsersQueryRepository,

    @Inject(SIGN_TOKEN_PORT)
    private readonly signTokenPort: ISignTokenPort,
  ) {}

  public async execute(request: ILoginRequest): Promise<LoginResponse> {
    const userId = (await this.userReaderPort.findByEmail(request.email))?.id;

    if (!userId) {
      throw new UnauthorizedException('Email or password wrong');
    }

    const authUser = await this.authUsersQueryRepository.findByUserId(userId);
    if (!authUser) {
      throw new UnauthorizedException('Email or password wrong');
    }

    if (
      !(await this.passwordHasherPort.compare(
        request.password,
        authUser.password,
      ))
    ) {
      throw new UnauthorizedException('Email or password wrong');
    }

    return new LoginResponse(
      this.signTokenPort.signAccessToken({ sub: userId, email: request.email }),
      this.signTokenPort.signRefreshToken({ sub: userId }),
    );
  }
}
