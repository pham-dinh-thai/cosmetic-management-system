import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { FindVariantsInUseUseCase } from 'apps/order-service/src/application/use-cases/find-variants-in-use/find-variants-in-use.use-case';

class FindVariantsInUseRequest {
  public variantIds: string[] = [];
}

@Controller('internal/orders')
export class InternalOrdersController {
  public constructor(
    private readonly findVariantsInUseUseCase: FindVariantsInUseUseCase,
  ) {}

  @Post('variants-in-use')
  @HttpCode(HttpStatus.OK)
  public async findVariantsInUse(
    @Body() request: FindVariantsInUseRequest,
  ): Promise<{ variantIds: string[] }> {
    const variantIds = Array.isArray(request.variantIds)
      ? request.variantIds
      : [];

    const inUse = await this.findVariantsInUseUseCase.execute(variantIds);

    return { variantIds: inUse };
  }
}
