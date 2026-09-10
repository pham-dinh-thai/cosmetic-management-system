import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { OrderPaymentMethod, OrderStatus } from '../../../domain/types';
import { IEmployeeCodeReaderPort } from './ports/employee-code-reader.port';
import { IVariantLabelReaderPort } from './ports/variant-label-reader.port';

export interface OrderReceiptLine {
  variantId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderReceipt {
  id: string;
  code: string;
  status: OrderStatus;
  customerLabel: string;
  paymentMethod: OrderPaymentMethod;
  employeeCode: string | null;
  totalAmount: number;
  lines: OrderReceiptLine[];
  createdAt: Date | undefined;
}

export class PrintOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly variantLabelReaderPort: IVariantLabelReaderPort,
    private readonly employeeCodeReaderPort: IEmployeeCodeReaderPort,
  ) {}

  public async execute(
    id: string,
    userId?: string,
  ): Promise<OrderReceipt> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    const lines = order.getLines();
    const labels = await this.variantLabelReaderPort.getVariantLabels(
      lines.map((line) => line.getVariantId()),
    );
    const employeeCode = userId
      ? await this.employeeCodeReaderPort.getEmployeeCode(userId)
      : null;

    return {
      id: order.getId(),
      code: order.getCode(),
      status: order.getStatus(),
      customerLabel: order.getCustomerId() ?? 'Khách lẻ (Tại quầy)',
      paymentMethod: order.getPaymentMethod(),
      employeeCode,
      totalAmount: order.getTotalAmount(),
      lines: lines.map((line) => ({
        variantId: line.getVariantId(),
        name: labels[line.getVariantId()] ?? line.getVariantId(),
        quantity: line.getQuantity(),
        unitPrice: line.getUnitPrice(),
        subtotal: line.getSubtotal(),
      })),
      createdAt: order.getCreatedAt(),
    };
  }
}

export const printOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  variantLabelReaderPort: IVariantLabelReaderPort,
  employeeCodeReaderPort: IEmployeeCodeReaderPort,
): PrintOrderUseCase =>
  new PrintOrderUseCase(
    ordersRepository,
    variantLabelReaderPort,
    employeeCodeReaderPort,
  );