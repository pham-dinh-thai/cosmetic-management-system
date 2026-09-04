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
import { FindAllCategoriesUseCase } from 'apps/category-service/src/application/use-cases/find-category/find-all/find-all-categories.use-case';
import { FindAllCategoryReadModel } from 'apps/category-service/src/application/use-cases/find-category/find-all/read-models/find-all-category.read-model';
import { FindCategoryByIdUseCase } from 'apps/category-service/src/application/use-cases/find-category/find-by-id/find-category-by-id.use-case';
import { FindCategoryByIdReadModel } from 'apps/category-service/src/application/use-cases/find-category/find-by-id/read-models/find-category-by-id.read-model';
import { CreateCategoryUseCase } from 'apps/category-service/src/application/use-cases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from 'apps/category-service/src/application/use-cases/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from 'apps/category-service/src/application/use-cases/delete-category/delete-category.use-case';
import { ActivateCategoryUseCase } from 'apps/category-service/src/application/use-cases/activate-category/activate-category.use-case';
import { DeactivateCategoryUseCase } from 'apps/category-service/src/application/use-cases/deactivate-category/deactivate-category.use-case';
import { CreateCategoryRequest } from './requests/create-category.request';
import { UpdateCategoryRequest } from './requests/update-category.request';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('categories')
export class CategoriesController {
  public constructor(
    private readonly findAllCategoriesUseCase: FindAllCategoriesUseCase,
    private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly activateCategoryUseCase: ActivateCategoryUseCase,
    private readonly deactivateCategoryUseCase: DeactivateCategoryUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query('search') search?: string,
  ): Promise<FindAllCategoryReadModel[]> {
    return await this.findAllCategoriesUseCase.execute(search);
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<FindCategoryByIdReadModel | null> {
    return await this.findCategoryByIdUseCase.execute(id);
  }

  @Post()
  public async create(
    @Body() request: CreateCategoryRequest,
  ): Promise<{ id: string }> {
    return await this.createCategoryUseCase.execute(request);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateCategoryRequest,
  ): Promise<void> {
    await this.updateCategoryUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/activate')
  public async activate(@Param('id') id: string): Promise<void> {
    await this.activateCategoryUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/deactivate')
  public async deactivate(@Param('id') id: string): Promise<void> {
    await this.deactivateCategoryUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteCategoryUseCase.execute(id);
  }
}
