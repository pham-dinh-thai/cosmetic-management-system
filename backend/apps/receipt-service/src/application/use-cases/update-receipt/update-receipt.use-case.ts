import { ReceiptNotFoundException } from '../../../domain/exceptions/receipt-not-found.exception';
import { ReceiptsRepository } from '../../../domain/repositories/receipts.repository';

export class UpdateReceiptNoteUseCase {
  public constructor(private readonly receiptsRepository: ReceiptsRepository) {}

  public async execute(id: string, note?: string): Promise<void> {
    const updated = await this.receiptsRepository.updateNote(id, note);

    if (!updated) {
      throw new ReceiptNotFoundException(id);
    }
  }
}

export const updateReceiptNoteUseCaseFactory = (
  receiptsRepository: ReceiptsRepository,
): UpdateReceiptNoteUseCase => new UpdateReceiptNoteUseCase(receiptsRepository);