import { IRegisterRequest } from './register.request';
import { RegisterResponse } from './register.response';
import { ICreateUserPort } from './ports/create-user.port';
import {
  ICreateCustomerPort,
  ICreateCustomerPhonePort,
  ICreateCustomerAddressPort,
} from './ports/create-customer.port';
import { IDeleteCustomerPort } from './ports/delete-customer.port';
import { IDeleteUserPort } from './ports/delete-user.port';
import { ISignTokenPort } from '../../ports/sign-token.port';
import { IRolePermissionReaderPort } from 'apps/authentication-service/src/application/ports/role-permission-reader.port';
import { EmailAlreadyExistsException } from 'apps/authentication-service/src/domain/exceptions/email-already-exists.exception';
import { PasswordNotMatchingException } from 'apps/authentication-service/src/domain/exceptions/password-not-matching.exception';
import { IFindUserByEmailPort } from '../../ports/find-user-by-email.port';
import { Logger } from '@nestjs/common';

const REGISTER_ROLE_ID = 'customer';

export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name);

  public constructor(
    private readonly findUserByEmailPort: IFindUserByEmailPort,
    private readonly createUserPort: ICreateUserPort,
    private readonly createCustomerPort: ICreateCustomerPort,
    private readonly createCustomerPhonePort: ICreateCustomerPhonePort,
    private readonly createCustomerAddressPort: ICreateCustomerAddressPort,
    private readonly deleteCustomerPort: IDeleteCustomerPort,
    private readonly deleteUserPort: IDeleteUserPort,
    private readonly signTokenPort: ISignTokenPort,
    private readonly rolePermissionReaderPort: IRolePermissionReaderPort,
  ) {}

  private async rollbackRegistration(
    customerId: string,
    userId: string,
  ): Promise<void> {
    try {
      await this.deleteCustomerPort.execute(customerId);
      await this.deleteUserPort.execute(userId);
    } catch (error) {
      this.logger.error(
        `Failed to rollback registration for user ${userId}`,
        error instanceof Error ? error.message : undefined,
      );
    }
  }

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

    const { id: customerId } = await this.createCustomerPort.execute({
      userId,
    });

    try {
      if (request.phone?.trim()) {
        await this.createCustomerPhonePort.execute({
          customerId,
          phone: request.phone.trim(),
        });
      }

      if (request.address?.trim()) {
        await this.createCustomerAddressPort.execute({
          customerId,
          street: request.address.trim(),
        });
      }
    } catch (error) {
      await this.rollbackRegistration(customerId, userId);

      throw error;
    }

    const permissions =
      await this.rolePermissionReaderPort.findByRoleId(REGISTER_ROLE_ID);

    return new RegisterResponse(
      this.signTokenPort.signAccessToken({
        sub: userId,
        email: request.email,
        roleId: REGISTER_ROLE_ID,
        permissions,
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
  createCustomerPhonePort: ICreateCustomerPhonePort,
  createCustomerAddressPort: ICreateCustomerAddressPort,
  deleteCustomerPort: IDeleteCustomerPort,
  deleteUserPort: IDeleteUserPort,
  signTokenPort: ISignTokenPort,
  rolePermissionReaderPort: IRolePermissionReaderPort,
): RegisterUseCase =>
  new RegisterUseCase(
    findUserByEmailPort,
    createUserPort,
    createCustomerPort,
    createCustomerPhonePort,
    createCustomerAddressPort,
    deleteCustomerPort,
    deleteUserPort,
    signTokenPort,
    rolePermissionReaderPort,
  );
