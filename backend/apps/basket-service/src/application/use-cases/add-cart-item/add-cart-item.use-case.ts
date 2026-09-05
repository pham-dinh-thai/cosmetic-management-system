import { type ICartsRepository } from '../../../domain/repositories/carts.repository';
import { type ICustomerReaderPort } from '../../ports/customer-reader.port';
import { type IVariantReaderPort } from '../../ports/variant-reader.port';
import { CustomerNotFoundException } from '../../../domain/exceptions/customer-not-found.exception';
import { VariantNotFoundException } from '../../../domain/exceptions/variant-not-found.exception';
import { Cart } from '../../../domain/cart.aggregate';

export interface IAddCartItemRequest {
  userId: string;
  variantId: string;
  quantity: number;
}

export class AddCartItemUseCase {
  public constructor(
    private readonly cartsRepository: ICartsRepository,
    private readonly customerReaderPort: ICustomerReaderPort,
    private readonly variantReaderPort: IVariantReaderPort,
  ) {}

  public async execute(request: IAddCartItemRequest): Promise<void> {
    const customer = await this.customerReaderPort.findByUserId(request.userId);

    if (!customer) {
      throw new CustomerNotFoundException(request.userId);
    }

    const variant = await this.variantReaderPort.findById(request.variantId);

    if (!variant) {
      throw new VariantNotFoundException(request.variantId);
    }

    const cart =
      (await this.cartsRepository.findByCustomerId(customer.id)) ??
      Cart.create({ customerId: customer.id });

    cart.addItem(request.variantId, request.quantity);

    if (cart.getId()) {
      await this.cartsRepository.save(cart);
    } else {
      await this.cartsRepository.create(cart);
    }
  }
}

export const addCartItemUseCaseFactory = (
  cartsRepository: ICartsRepository,
  customerReaderPort: ICustomerReaderPort,
  variantReaderPort: IVariantReaderPort,
): AddCartItemUseCase =>
  new AddCartItemUseCase(
    cartsRepository,
    customerReaderPort,
    variantReaderPort,
  );
