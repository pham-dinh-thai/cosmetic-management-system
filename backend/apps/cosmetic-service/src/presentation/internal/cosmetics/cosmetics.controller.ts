import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindVariantByIdUseCase } from 'apps/cosmetic-service/src/application/use-cases/find-variant/find-by-id/find-variant-by-id.use-case';
import { VariantReadData } from 'apps/cosmetic-service/src/application/use-cases/find-variant/find-by-id/find-variant-by-id.use-case';
import { FindVariantsByIdsUseCase } from 'apps/cosmetic-service/src/application/use-cases/find-variant/find-by-ids/find-variants-by-ids.use-case';
import { VariantLabelReadData } from 'apps/cosmetic-service/src/application/use-cases/find-variant/find-by-ids/find-variants-by-ids.use-case';

@Controller('internal/cosmetics')
export class InternalCosmeticsController {
  public constructor(
    private readonly findVariantByIdUseCase: FindVariantByIdUseCase,
    private readonly findVariantsByIdsUseCase: FindVariantsByIdsUseCase,
  ) {}

  @Get('variants/batch')
  public async findVariantsByIds(
    @Query('ids') ids: string,
  ): Promise<VariantLabelReadData[]> {
    const variantIds = (ids ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    return await this.findVariantsByIdsUseCase.execute(variantIds);
  }

  @Get('variants/:id')
  public async findVariantById(
    @Param('id') id: string,
  ): Promise<VariantReadData | null> {
    return await this.findVariantByIdUseCase.execute(id);
  }
}
