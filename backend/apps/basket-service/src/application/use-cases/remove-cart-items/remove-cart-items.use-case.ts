import { type ICartsRepository } from '../../../domain/repositories/carts.repository';

export interface IRemoveCartItemsRequest {
  customerId: string;
  lines: { variantId: string; quantity: number }[];
}

export class RemoveCartItemsUseCase {
  public constructor(private readonly cartsRepository: ICartsRepository) {}

  public async execute(request: IRemoveCartItemsRequest): Promise<void> {
    const cart = await this.cartsRepository.findByCustomerId(
      request.customerId,
    );

    if (!cart) {
      return;
    }

    for (const line of request.lines) {
      cart.decreaseItem(line.variantId, line.quantity);
    }

    await this.cartsRepository.save(cart);
  }
}

export const removeCartItemsUseCaseFactory = (
  cartsRepository: ICartsRepository,
): RemoveCartItemsUseCase => new RemoveCartItemsUseCase(cartsRepository);
