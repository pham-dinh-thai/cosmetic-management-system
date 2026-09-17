import { ReceiptNotFoundException } from '../../../domain/exceptions/receipt-not-found.exception';
import { ReceiptsRepository } from '../../../domain/repositories/receipts.repository';

export class DeleteReceiptUseCase {
  public constructor(private readonly receiptsRepository: ReceiptsRepository) {}

  public async execute(id: string): Promise<void> {
    const deleted = await this.receiptsRepository.delete(id);

    if (!deleted) {
      throw new ReceiptNotFoundException(id);
    }
  }
}

export const deleteReceiptUseCaseFactory = (
  receiptsRepository: ReceiptsRepository,
): DeleteReceiptUseCase => new DeleteReceiptUseCase(receiptsRepository);