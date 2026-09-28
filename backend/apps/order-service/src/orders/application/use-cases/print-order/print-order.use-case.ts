import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { ICustomerNameReaderPort } from '../../ports/customer-name-reader.port';
import { IEmployeeCodeReaderPort } from '../../ports/employee-code-reader.port';
import { IVariantLabelReaderPort } from '../../ports/variant-label-reader.port';
import { OrderPaymentMethod } from '../../../../shared/domain/enums/order-payment-method.enum';
import { OrderPaymentStatus } from '../../../../shared/domain/enums/order-payment-status.enum';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';

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
  customerCode: string;
  customerName: string;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: OrderPaymentStatus;
  employeeCode: string | null;
  totalAmount: number;
  lines: OrderReceiptLine[];
  createdAt: Date;
}

const WALK_IN_CUSTOMER_NAME = 'Khách lẻ (Tại quầy)';

export class PrintOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly variantLabelReaderPort: IVariantLabelReaderPort,
    private readonly employeeCodeReaderPort: IEmployeeCodeReaderPort,
    private readonly customerNameReaderPort: ICustomerNameReaderPort,
  ) {}

  public async execute(id: string, userId?: string): Promise<OrderReceipt> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    const lines = order.getLines();
    const labels = await this.variantLabelReaderPort.getVariantLabels(
      lines.map((line) => line.getVariantId()),
    );
    const customerId = order.getCustomerId();
    const customerLabel = customerId
      ? await this.customerNameReaderPort.getCustomerLabel(customerId)
      : null;
    const employeeCode = userId
      ? await this.employeeCodeReaderPort.getEmployeeCode(userId)
      : null;

    return {
      id: order.getId(),
      code: order.getCode(),
      status: order.getStatus(),
      customerCode: customerLabel?.code ?? '',
      customerName: customerLabel?.name ?? WALK_IN_CUSTOMER_NAME,
      paymentMethod: order.getPaymentMethod(),
      paymentStatus: order.getPaymentStatus(),
      employeeCode,
      totalAmount: order.getTotalAmount(),
      lines: lines.map((line) => ({
        variantId: line.getVariantId(),
        name: labels[line.getVariantId()] ?? line.getVariantId(),
        quantity: line.getQuantity(),
        unitPrice: line.getUnitPrice(),
        subtotal: line.getSubtotal(),
      })),
      createdAt: order.getCreatedAt() ?? new Date(),
    };
  }
}

export const printOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  variantLabelReaderPort: IVariantLabelReaderPort,
  employeeCodeReaderPort: IEmployeeCodeReaderPort,
  customerNameReaderPort: ICustomerNameReaderPort,
): PrintOrderUseCase =>
  new PrintOrderUseCase(
    ordersRepository,
    variantLabelReaderPort,
    employeeCodeReaderPort,
    customerNameReaderPort,
  );
