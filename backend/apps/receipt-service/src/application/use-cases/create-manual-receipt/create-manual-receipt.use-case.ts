import { Receipt } from '../../../domain/receipt.aggregate';
import { ReceiptsRepository } from '../../../domain/repositories/receipts.repository';
import { ReceiptCode } from '../../../domain/value-objects/receipt-code.value-object';

export type CreateManualReceiptInput = {
  amount: number;
  invoiceId?: string;
  customerId?: string;
  note?: string;
  employeeId?: string;
};

export class CreateManualReceiptUseCase {
  public constructor(private readonly receiptsRepository: ReceiptsRepository) {}

  public async execute(
    input: CreateManualReceiptInput,
  ): Promise<{ id: string }> {
    const maxCodeSequence = await this.receiptsRepository.findMaxCodeSequence();
    const code = ReceiptCode.generate((maxCodeSequence ?? 0) + 1);

    const receipt = Receipt.create({
      code: code.getValue(),
      amount: input.amount,
      invoiceId: input.invoiceId,
      customerId: input.customerId,
      note: input.note,
      employeeId: input.employeeId,
    });

    return await this.receiptsRepository.create(receipt);
  }
}

export const createManualReceiptUseCaseFactory = (
  receiptsRepository: ReceiptsRepository,
): CreateManualReceiptUseCase =>
  new CreateManualReceiptUseCase(receiptsRepository);