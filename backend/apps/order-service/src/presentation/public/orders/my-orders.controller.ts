import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { Audit, AuditAction, paramId } from '@app/audit-client';
import { FindAllOrdersUseCase } from 'apps/order-service/src/application/use-cases/find-all-orders/find-all-orders.use-case';
import { FindOrderByIdUseCase } from 'apps/order-service/src/application/use-cases/find-order-by-id/find-order-by-id.use-case';
import { UpdateOrderStatusUseCase } from 'apps/order-service/src/application/use-cases/update-order-status/update-order-status.use-case';
import { OrderDetailReadModel } from 'apps/order-service/src/application/use-cases/find-order-by-id/read-models/order-detail.read-model';
import { OrderReadModel } from 'apps/order-service/src/application/use-cases/find-all-orders/read-models/order.read-model';
import { CUSTOMER_ID_READER_PORT } from 'apps/order-service/src/application/ports/customer-id-reader.port';
import type { ICustomerIdReaderPort } from 'apps/order-service/src/application/ports/customer-id-reader.port';
import { VARIANT_LABEL_READER_PORT } from 'apps/order-service/src/application/use-cases/print-order/ports/variant-label-reader.port';
import type { IVariantLabelReaderPort } from 'apps/order-service/src/application/use-cases/print-order/ports/variant-label-reader.port';
import { OrderStatus } from 'apps/order-service/src/domain/types';

type MyOrderDetailLine = OrderDetailReadModel['lines'][number] & {
  name?: string;
  variantName?: string;
};

type MyOrderDetailReadModel = Omit<OrderDetailReadModel, 'lines'> & {
  lines: MyOrderDetailLine[];
};

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Customer, Role.Admin, Role.Employee)
@Controller('orders')
export class MyOrdersController {
  public constructor(
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    @Inject(CUSTOMER_ID_READER_PORT)
    private readonly customerIdReader: ICustomerIdReaderPort,
    @Inject(VARIANT_LABEL_READER_PORT)
    private readonly variantLabelReader: IVariantLabelReaderPort,
  ) {}

  @Get('me')
  public async findMine(@Req() request: Request): Promise<OrderReadModel[]> {
    const customerId = await this.resolveCustomerId(request);

    if (!customerId) {
      return [];
    }

    return await this.findAllOrdersUseCase.execute({ customerId });
  }

  @Get('me/:id')
  public async findMineById(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<MyOrderDetailReadModel> {
    const detail = await this.assertMine(request, id);

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
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<{ id: string; status: OrderStatus }> {
    await this.assertMine(request, id);

    const userId = this.userId(request) ?? '';

    return await this.updateOrderStatusUseCase.execute(
      id,
      OrderStatus.CANCELLED,
      userId,
    );
  }

  private userId(request: Request): string | null {
    return (
      (request as unknown as { user?: { sub?: string } }).user?.sub ?? null
    );
  }

  private async resolveCustomerId(request: Request): Promise<string | null> {
    const userId = this.userId(request);

    if (!userId) {
      return null;
    }

    return await this.customerIdReader.getCustomerIdByUserId(userId);
  }

  private async assertMine(
    request: Request,
    id: string,
  ): Promise<OrderDetailReadModel> {
    const customerId = await this.resolveCustomerId(request);
    const detail = await this.findOrderByIdUseCase.execute(id);

    if (customerId && detail.customerId === customerId) {
      return detail;
    }

    throw new ForbiddenException();
  }
}
