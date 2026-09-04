import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { CreateCosmeticUseCase } from 'apps/cosmetic-service/src/application/use-cases/create-cosmetic/create-cosmetic.use-case';
import { FindAllCosmeticsUseCase } from 'apps/cosmetic-service/src/application/use-cases/find-cosmetic/find-all/find-all-cosmetics.use-case';
import { FindAllCosmeticReadModel } from 'apps/cosmetic-service/src/application/use-cases/find-cosmetic/find-all/read-models/find-all-cosmetic.read-model';
import { FindCosmeticByIdUseCase } from 'apps/cosmetic-service/src/application/use-cases/find-cosmetic/find-by-id/find-cosmetic-by-id.use-case';
import { FindCosmeticByIdReadModel } from 'apps/cosmetic-service/src/application/use-cases/find-cosmetic/find-by-id/read-models/find-cosmetic-by-id.read-model';
import { UpdateCosmeticUseCase } from 'apps/cosmetic-service/src/application/use-cases/update-cosmetic/update-cosmetic.use-case';
import { ActivateCosmeticUseCase } from 'apps/cosmetic-service/src/application/use-cases/activate-cosmetic/activate-cosmetic.use-case';
import { DeactivateCosmeticUseCase } from 'apps/cosmetic-service/src/application/use-cases/deactivate-cosmetic/deactivate-cosmetic.use-case';
import { DeleteCosmeticUseCase } from 'apps/cosmetic-service/src/application/use-cases/delete-cosmetic/delete-cosmetic.use-case';
import { AddVariantUseCase } from 'apps/cosmetic-service/src/application/use-cases/add-variant/add-variant.use-case';
import { UpdateVariantUseCase } from 'apps/cosmetic-service/src/application/use-cases/update-variant/update-variant.use-case';
import { ActivateVariantUseCase } from 'apps/cosmetic-service/src/application/use-cases/activate-variant/activate-variant.use-case';
import { DeactivateVariantUseCase } from 'apps/cosmetic-service/src/application/use-cases/deactivate-variant/deactivate-variant.use-case';
import { CreateCosmeticRequest } from './requests/create-cosmetic.request';
import { UpdateCosmeticRequest } from './requests/update-cosmetic.request';
import { AddVariantRequest } from './requests/add-variant.request';
import { UpdateVariantRequest } from './requests/update-variant.request';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('cosmetics')
export class CosmeticsController {
  public constructor(
    private readonly findAllCosmeticsUseCase: FindAllCosmeticsUseCase,
    private readonly findCosmeticByIdUseCase: FindCosmeticByIdUseCase,
    private readonly createCosmeticUseCase: CreateCosmeticUseCase,
    private readonly updateCosmeticUseCase: UpdateCosmeticUseCase,
    private readonly activateCosmeticUseCase: ActivateCosmeticUseCase,
    private readonly deactivateCosmeticUseCase: DeactivateCosmeticUseCase,
    private readonly deleteCosmeticUseCase: DeleteCosmeticUseCase,
    private readonly addVariantUseCase: AddVariantUseCase,
    private readonly updateVariantUseCase: UpdateVariantUseCase,
    private readonly activateVariantUseCase: ActivateVariantUseCase,
    private readonly deactivateVariantUseCase: DeactivateVariantUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query('search') search?: string,
  ): Promise<FindAllCosmeticReadModel[]> {
    return await this.findAllCosmeticsUseCase.execute(search);
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<FindCosmeticByIdReadModel | null> {
    return await this.findCosmeticByIdUseCase.execute(id);
  }

  @Post()
  public async create(
    @Body() request: CreateCosmeticRequest,
  ): Promise<{ id: string }> {
    return await this.createCosmeticUseCase.execute(request);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateCosmeticRequest,
  ): Promise<void> {
    await this.updateCosmeticUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/activate')
  public async activate(@Param('id') id: string): Promise<void> {
    await this.activateCosmeticUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/deactivate')
  public async deactivate(@Param('id') id: string): Promise<void> {
    await this.deactivateCosmeticUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteCosmeticUseCase.execute(id);
  }

  @Post(':id/variants')
  public async addVariant(
    @Param('id') id: string,
    @Body() request: AddVariantRequest,
  ): Promise<{ id: string }> {
    return await this.addVariantUseCase.execute(id, request);
  }

  @Put('variants/:variantId')
  public async updateVariant(
    @Param('variantId') variantId: string,
    @Body() request: UpdateVariantRequest,
  ): Promise<void> {
    await this.updateVariantUseCase.execute(variantId, request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('variants/:variantId/activate')
  public async activateVariant(
    @Param('variantId') variantId: string,
  ): Promise<void> {
    await this.activateVariantUseCase.execute(variantId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('variants/:variantId/deactivate')
  public async deactivateVariant(
    @Param('variantId') variantId: string,
  ): Promise<void> {
    await this.deactivateVariantUseCase.execute(variantId);
  }
}
