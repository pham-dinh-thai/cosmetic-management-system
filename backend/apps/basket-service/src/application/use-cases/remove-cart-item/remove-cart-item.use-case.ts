import { type ICartsRepository } from '../../../domain/repositories/carts.repository';
import { type ICustomerReaderPort } from '../../ports/customer-reader.port';
import { CustomerNotFoundException } from '../../../domain/exceptions/customer-not-found.exception';
import { CartItemNotFoundException } from '../../../domain/exceptions/cart-item-not-found.exception';

export interface IRemoveCartItemRequest {
  userId: string;
  variantId: string;
}

export class RemoveCartItemUseCase {
  public constructor(
    private readonly cartsRepository: ICartsRepository,
    private readonly customerReaderPort: ICustomerReaderPort,
  ) {}

  public async execute(request: IRemoveCartItemRequest): Promise<void> {
    const customer = await this.customerReaderPort.findByUserId(request.userId);

    if (!customer) {
      throw new CustomerNotFoundException(request.userId);
    }

    const cart = await this.cartsRepository.findByCustomerId(customer.id);

    if (!cart) {
      throw new CartItemNotFoundException(request.variantId);
    }

    cart.removeItem(request.variantId);
    await this.cartsRepository.save(cart);
  }
}

export const removeCartItemUseCaseFactory = (
  cartsRepository: ICartsRepository,
  customerReaderPort: ICustomerReaderPort,
): RemoveCartItemUseCase =>
  new RemoveCartItemUseCase(cartsRepository, customerReaderPort);
