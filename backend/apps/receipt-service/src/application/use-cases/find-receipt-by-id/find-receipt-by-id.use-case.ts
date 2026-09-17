import { ReceiptNotFoundException } from '../../../domain/exceptions/receipt-not-found.exception';
import { ReceiptsRepository } from '../../../domain/repositories/receipts.repository';
import { ReceiptReadModel } from '../find-all-receipts/read-models/receipt.read-model';

export class FindReceiptByIdUseCase {
  public constructor(private readonly receiptsRepository: ReceiptsRepository) {}

  public async execute(id: string): Promise<ReceiptReadModel> {
    const receipt = await this.receiptsRepository.findById(id);

    if (!receipt) {
      throw new ReceiptNotFoundException(id);
    }

    return ReceiptReadModel.from(receipt);
  }
}

export const findReceiptByIdUseCaseFactory = (
  receiptsRepository: ReceiptsRepository,
): FindReceiptByIdUseCase => new FindReceiptByIdUseCase(receiptsRepository);