import { randomUUID } from 'node:crypto';
import { IRegisterRequest } from './register.request';
import { RegisterResponse } from './register.response';
import { ICreateUserPort } from './ports/create-user.port';
import { ICreateCustomerPort } from './ports/create-customer.port';
import { ISignTokenPort } from '../../ports/sign-token.port';
import { EmailAlreadyExistsException } from 'apps/authentication-service/src/domain/exceptions/email-already-exists.exception';
import { PasswordNotMatchingException } from 'apps/authentication-service/src/domain/exceptions/password-not-matching.exception';
import { IFindUserByEmailPort } from '../../ports/find-user-by-email.port';

const REGISTER_ROLE_ID = 'customer';

export class RegisterUseCase {
  public constructor(
    private readonly findUserByEmailPort: IFindUserByEmailPort,
    private readonly createUserPort: ICreateUserPort,
    private readonly createCustomerPort: ICreateCustomerPort,
    private readonly signTokenPort: ISignTokenPort,
  ) {}

  public async execute(request: IRegisterRequest): Promise<RegisterResponse> {
    const user = await this.findUserByEmailPort.execute(request.email);

    if (user) {
      throw new EmailAlreadyExistsException(request.email);
    }

    if (request.password !== request.passwordConfirmation) {
      throw new PasswordNotMatchingException();
    }

    const { id: userId } = await this.createUserPort.execute({
      firstName: request.firstName,
      lastName: request.lastName,
      gender: request.gender,
      email: request.email,
      password: request.password,
      roleId: REGISTER_ROLE_ID,
    });

    await this.createCustomerPort.execute({
      userId,
      code: `CUS-${randomUUID().slice(0, 8).toUpperCase()}`,
    });

    return new RegisterResponse(
      this.signTokenPort.signAccessToken({
        sub: userId,
        email: request.email,
        roleId: REGISTER_ROLE_ID,
      }),
      this.signTokenPort.signRefreshToken({ sub: userId }),
      userId,
    );
  }
}

export const registerUseCaseFactory = (
  findUserByEmailPort: IFindUserByEmailPort,
  createUserPort: ICreateUserPort,
  createCustomerPort: ICreateCustomerPort,
  signTokenPort: ISignTokenPort,
): RegisterUseCase =>
  new RegisterUseCase(
    findUserByEmailPort,
    createUserPort,
    createCustomerPort,
    signTokenPort,
  );
