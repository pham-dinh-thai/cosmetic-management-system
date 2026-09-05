import { type ICartsRepository } from '../../../domain/repositories/carts.repository';
import { type ICustomerReaderPort } from '../../ports/customer-reader.port';
import { type IVariantReaderPort } from '../../ports/variant-reader.port';
import { CustomerNotFoundException } from '../../../domain/exceptions/customer-not-found.exception';
import { VariantNotFoundException } from '../../../domain/exceptions/variant-not-found.exception';
import {
  CartReadModel,
  CartItemReadModel,
  IGetCartRequest,
} from './get-cart.read-model';

export class GetCartUseCase {
  public constructor(
    private readonly cartsRepository: ICartsRepository,
    private readonly customerReaderPort: ICustomerReaderPort,
    private readonly variantReaderPort: IVariantReaderPort,
  ) {}

  public async execute(request: IGetCartRequest): Promise<CartReadModel> {
    const customer = await this.customerReaderPort.findByUserId(request.userId);

    if (!customer) {
      throw new CustomerNotFoundException(request.userId);
    }

    const cart = await this.cartsRepository.findByCustomerId(customer.id);

    if (!cart || !cart.hasItems()) {
      return CartReadModel.empty(customer.id);
    }

    const items: CartItemReadModel[] = [];
    let total = 0;

    for (const item of cart.getItems()) {
      const variant = await this.variantReaderPort.findById(
        item.getVariantId(),
      );

      if (!variant) {
        throw new VariantNotFoundException(item.getVariantId());
      }

      const lineTotal = variant.price * item.getQuantity();
      total += lineTotal;

      items.push(
        new CartItemReadModel(
          item.getVariantId(),
          variant.name,
          item.getQuantity(),
          variant.price,
          lineTotal,
        ),
      );
    }

    return new CartReadModel(
      cart.getId(),
      customer.id,
      cart.getStatus(),
      items,
      total,
    );
  }
}

export const getCartUseCaseFactory = (
  cartsRepository: ICartsRepository,
  customerReaderPort: ICustomerReaderPort,
  variantReaderPort: IVariantReaderPort,
): GetCartUseCase =>
  new GetCartUseCase(cartsRepository, customerReaderPort, variantReaderPort);
