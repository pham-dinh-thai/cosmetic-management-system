import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, CurrentUser, Role, Roles, RolesGuard } from '@app/security';
import { Audit, AuditAction, paramId } from '@app/audit-client';
import { FindMyOrdersUseCase } from '../../../application/use-cases/find-my-orders/find-my-orders.use-case';
import { ViewMyOrderUseCase } from '../../../application/use-cases/view-my-order/view-my-order.use-case';
import { CancelMyOrderUseCase } from '../../../application/use-cases/cancel-my-order/cancel-my-order.use-case';
import { MyOrderDetailReadModel } from '../../../application/use-cases/view-my-order/my-order-detail.read-model';
import { MyOrderSummaryReadModel } from '../../../application/use-cases/find-my-orders/my-order-summary.read-model';
import { CUSTOMER_ID_READER_PORT } from '../../../application/ports/customer-id-reader.port';
import type { ICustomerIdReaderPort } from '../../../application/ports/customer-id-reader.port';
import { VARIANT_LABEL_READER_PORT } from '../../../application/ports/variant-label-reader.port';
import type { IVariantLabelReaderPort } from '../../../application/ports/variant-label-reader.port';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';

type MyOrderDetailLine = MyOrderDetailReadModel['lines'][number] & {
  name?: string;
  variantName?: string;
};

type MyOrderDetailView = Omit<MyOrderDetailReadModel, 'lines'> & {
  lines: MyOrderDetailLine[];
};

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Customer, Role.Admin, Role.Employee)
@Controller('orders')
export class MyOrdersController {
  public constructor(
    private readonly findMyOrdersUseCase: FindMyOrdersUseCase,
    private readonly viewMyOrderUseCase: ViewMyOrderUseCase,
    private readonly cancelMyOrderUseCase: CancelMyOrderUseCase,
    @Inject(CUSTOMER_ID_READER_PORT)
    private readonly customerIdReader: ICustomerIdReaderPort,
    @Inject(VARIANT_LABEL_READER_PORT)
    private readonly variantLabelReader: IVariantLabelReaderPort,
  ) {}

  @Get('me')
  public async findMine(
    @CurrentUser('sub') userId: string | undefined,
  ): Promise<MyOrderSummaryReadModel[]> {
    const customerId = await this.resolveCustomerId(userId);

    if (!customerId) {
      return [];
    }

    return await this.findMyOrdersUseCase.execute(customerId);
  }

  @Get('me/:id')
  public async findMineById(
    @CurrentUser('sub') userId: string | undefined,
    @Param('id') id: string,
  ): Promise<MyOrderDetailView> {
    const customerId = await this.requireCustomerId(userId);
    const detail = await this.viewMyOrderUseCase.execute(id, customerId);

    const variantData = await this.variantLabelReader.getVariantData(
      detail.lines.map((line) => line.variantId),
    );

    return {
      ...detail,
      lines: detail.lines.map((line) => ({
        ...line,
        name: variantData[line.variantId]?.cosmeticName,
        variantName: variantData[line.variantId]?.variantName ?? undefined,
      })),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch('me/:id/cancel')
  @Audit({
    entityType: 'order',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async cancelMine(
    @CurrentUser('sub') userId: string | undefined,
    @Param('id') id: string,
  ): Promise<{ id: string; status: OrderStatus }> {
    const customerId = await this.requireCustomerId(userId);

    return await this.cancelMyOrderUseCase.execute(id, customerId);
  }

  private async resolveCustomerId(
    userId: string | undefined,
  ): Promise<string | null> {
    if (!userId) {
      return null;
    }

    return await this.customerIdReader.getCustomerIdByUserId(userId);
  }

  private async requireCustomerId(userId: string | undefined): Promise<string> {
    const customerId = await this.resolveCustomerId(userId);

    if (!customerId) {
      throw new ForbiddenException();
    }

    return customerId;
  }
}
