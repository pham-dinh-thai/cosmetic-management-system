import { Controller, Get, Query } from '@nestjs/common';
import {
  FindBestSellersUseCase,
  BestSellerReadModel,
} from 'apps/order-service/src/application/use-cases/find-best-sellers/find-best-sellers.use-case';

@Controller('orders')
export class BestSellersController {
  public constructor(
    private readonly findBestSellersUseCase: FindBestSellersUseCase,
  ) {}

  @Get('best-sellers')
  public async findBestSellers(
    @Query('limit') limit?: number,
  ): Promise<BestSellerReadModel[]> {
    const parsedLimit = limit === undefined ? 4 : Number(limit);
    return await this.findBestSellersUseCase.execute(parsedLimit);
  }
}