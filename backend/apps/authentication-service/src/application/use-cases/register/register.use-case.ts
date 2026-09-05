import { randomUUID } from 'node:crypto';
import { IRegisterRequest } from './register.request';
import { RegisterResponse } from './register.response';
import { type ICreateUserPort } from '../../ports/create-user.port';
import { type ICreateCustomerPort } from '../../ports/create-customer.port';
import { type ISignTokenPort } from '../../ports/sign-token.port';
import { EmailUniquenessService } from '../../../domain/services/email-uniqueness.service';

const REGISTER_ROLE_ID = 'customer';

export class RegisterUseCase {
  public constructor(
    private readonly emailUniquenessService: EmailUniquenessService,
    private readonly createUserPort: ICreateUserPort,
    private readonly createCustomerPort: ICreateCustomerPort,
    private readonly signTokenPort: ISignTokenPort,
  ) {}

  public async execute(request: IRegisterRequest): Promise<RegisterResponse> {
    await this.emailUniquenessService.ensureEmailIsUnique(request.email);

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
  emailUniquenessService: EmailUniquenessService,
  createUserPort: ICreateUserPort,
  createCustomerPort: ICreateCustomerPort,
  signTokenPort: ISignTokenPort,
): RegisterUseCase =>
  new RegisterUseCase(
    emailUniquenessService,
    createUserPort,
    createCustomerPort,
    signTokenPort,
  );
