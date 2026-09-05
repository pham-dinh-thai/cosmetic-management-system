import { Controller, Get, Param } from '@nestjs/common';
import { FindVariantByIdUseCase } from 'apps/cosmetic-service/src/application/use-cases/find-variant/find-by-id/find-variant-by-id.use-case';
import { VariantReadData } from 'apps/cosmetic-service/src/application/use-cases/find-variant/find-by-id/find-variant-by-id.use-case';

@Controller('internal/cosmetics')
export class InternalCosmeticsController {
  public constructor(
    private readonly findVariantByIdUseCase: FindVariantByIdUseCase,
  ) {}

  @Get('variants/:id')
  public async findVariantById(
    @Param('id') id: string,
  ): Promise<VariantReadData | null> {
    return await this.findVariantByIdUseCase.execute(id);
  }
}
