import { ReceiptSource } from '../../../domain/types';
import { ReceiptsRepository } from '../../../domain/repositories/receipts.repository';
import { ReceiptReadModel } from './read-models/receipt.read-model';

export class FindAllReceiptsUseCase {
  public constructor(private readonly receiptsRepository: ReceiptsRepository) {}

  public async execute(options?: {
    search?: string;
    source?: ReceiptSource;
    invoiceId?: string;
    customerId?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<ReceiptReadModel[]> {
    const receipts = await this.receiptsRepository.findAll({
      search: options?.search,
      source: options?.source,
      invoiceId: options?.invoiceId,
      customerId: options?.customerId,
      fromDate: options?.fromDate ? new Date(options.fromDate) : undefined,
      toDate: options?.toDate ? new Date(options.toDate) : undefined,
    });

    return receipts.map((receipt) => ReceiptReadModel.from(receipt));
  }
}

export const findAllReceiptsUseCaseFactory = (
  receiptsRepository: ReceiptsRepository,
): FindAllReceiptsUseCase => new FindAllReceiptsUseCase(receiptsRepository);