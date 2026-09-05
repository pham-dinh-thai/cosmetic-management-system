import { type ICartsRepository } from '../../../domain/repositories/carts.repository';
import { type ICustomerReaderPort } from '../../ports/customer-reader.port';
import { type IVariantReaderPort } from '../../ports/variant-reader.port';
import { type ICreateOrderPort } from '../../ports/create-order.port';
import { CustomerNotFoundException } from '../../../domain/exceptions/customer-not-found.exception';
import { EmptyCartException } from '../../../domain/exceptions/empty-cart.exception';
import { VariantNotFoundException } from '../../../domain/exceptions/variant-not-found.exception';

export interface ICheckoutRequest {
  userId: string;
}

export class CheckoutUseCase {
  public constructor(
    private readonly cartsRepository: ICartsRepository,
    private readonly customerReaderPort: ICustomerReaderPort,
    private readonly variantReaderPort: IVariantReaderPort,
    private readonly createOrderPort: ICreateOrderPort,
  ) {}

  public async execute(
    request: ICheckoutRequest,
  ): Promise<{ orderId: string }> {
    const customer = await this.customerReaderPort.findByUserId(request.userId);

    if (!customer) {
      throw new CustomerNotFoundException(request.userId);
    }

    const cart = await this.cartsRepository.findByCustomerId(customer.id);

    if (!cart || !cart.hasItems()) {
      throw new EmptyCartException();
    }

    const lines: {
      variantId: string;
      quantity: number;
      unitPrice: number;
    }[] = [];

    for (const item of cart.getItems()) {
      const variant = await this.variantReaderPort.findById(
        item.getVariantId(),
      );

      if (!variant) {
        throw new VariantNotFoundException(item.getVariantId());
      }

      lines.push({
        variantId: item.getVariantId(),
        quantity: item.getQuantity(),
        unitPrice: variant.price,
      });
    }

    const { id: orderId } = await this.createOrderPort.execute({
      customerId: customer.id,
      lines,
    });

    cart.markCheckedOut();
    await this.cartsRepository.save(cart);

    return { orderId };
  }
}

export const checkoutUseCaseFactory = (
  cartsRepository: ICartsRepository,
  customerReaderPort: ICustomerReaderPort,
  variantReaderPort: IVariantReaderPort,
  createOrderPort: ICreateOrderPort,
): CheckoutUseCase =>
  new CheckoutUseCase(
    cartsRepository,
    customerReaderPort,
    variantReaderPort,
    createOrderPort,
  );
