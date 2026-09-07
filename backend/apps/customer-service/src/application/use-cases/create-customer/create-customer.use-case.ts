import { ICreateCustomerRequest } from './create-customer.request';
import { Customer } from '../../../domain/customer.aggregate';
import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';
import { type ICreateUserPort } from './ports/create-user.port';
import { type IDeleteUserPort } from './ports/delete-user.port';
import { Logger } from '@nestjs/common';

export class CreateCustomerUseCase {
  private readonly logger = new Logger(CreateCustomerUseCase.name);

  public constructor(
    private readonly createUserPort: ICreateUserPort,
    private readonly customersRepository: ICustomersRepository,
    private readonly deleteUserPort: IDeleteUserPort,
  ) {}

  public async execute(
    request: ICreateCustomerRequest,
  ): Promise<{ id: string }> {
    let userId = request.userId ?? '';

    if (request.user) {
      const user = await this.createUserPort.execute({
        firstName: request.user.firstName,
        lastName: request.user.lastName,
        gender: request.user.gender,
        email: request.user.email,
        password: request.user.password,
        roleId: request.user.roleId,
      });

      userId = user.id;
    }

    const customers = await this.customersRepository.findAll();

    const code =
      request.code && request.code.trim().length > 0
        ? request.code
        : `KH-${String(customers.length + 1).padStart(3, '0')}`;

    try {
      const customer = Customer.create({
        userId,
        code,
        phone: request.phone ?? '',
        address: request.address ?? '',
      });

      return await this.customersRepository.create(customer);
    } catch (error) {
      if (request.user && userId) {
        const isUserDeleted = await this.deleteUserPort.execute(userId);

        if (!isUserDeleted) {
          this.logger.error(
            `Failed to delete user ${userId} during create-customer compensation`,
          );
        }
      }

      throw error;
    }
  }
}

export const createCustomerUseCaseFactory = (
  createUserPort: ICreateUserPort,
  customersRepository: ICustomersRepository,
  deleteUserPort: IDeleteUserPort,
): CreateCustomerUseCase =>
  new CreateCustomerUseCase(
    createUserPort,
    customersRepository,
    deleteUserPort,
  );
