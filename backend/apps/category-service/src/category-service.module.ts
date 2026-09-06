import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Category } from './infrastructure/entities/category.entity';
import { CategoriesController } from './presentation/public/categories/categories.controller';
import { CATEGORIES_REPOSITORY } from './domain/repositories/categories.repository';
import { MikroCategoriesRepository } from './infrastructure/repositories/mikro-categories.repository';
import {
  CreateCategoryUseCase,
  createCategoryUseCaseFactory,
} from './application/use-cases/create-category/create-category.use-case';
import {
  FindCategoryByIdUseCase,
  findCategoryByIdUseCaseFactory,
} from './application/use-cases/find-category/find-by-id/find-category-by-id.use-case';
import {
  FindAllCategoriesUseCase,
  findAllCategoriesUseCaseFactory,
} from './application/use-cases/find-category/find-all/find-all-categories.use-case';
import {
  UpdateCategoryUseCase,
  updateCategoryUseCaseFactory,
} from './application/use-cases/update-category/update-category.use-case';
import {
  DeleteCategoryUseCase,
  deleteCategoryUseCaseFactory,
} from './application/use-cases/delete-category/delete-category.use-case';
import {
  ActivateCategoryUseCase,
  activateCategoryUseCaseFactory,
} from './application/use-cases/activate-category/activate-category.use-case';
import {
  DeactivateCategoryUseCase,
  deactivateCategoryUseCaseFactory,
} from './application/use-cases/deactivate-category/deactivate-category.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('CATEGORY_DB_HOST'),
        port: config.get<number>('CATEGORY_DB_PORT'),
        user: config.get<string>('CATEGORY_DB_USER'),
        password: config.get<string>('CATEGORY_DB_PASSWORD'),
        dbName: config.get<string>('CATEGORY_DB_NAME'),
        entities: [Category],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Category]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CategoriesController],
  providers: [
    { provide: CATEGORIES_REPOSITORY, useClass: MikroCategoriesRepository },
    {
      provide: CreateCategoryUseCase,
      useFactory: createCategoryUseCaseFactory,
      inject: [CATEGORIES_REPOSITORY],
    },
    {
      provide: FindCategoryByIdUseCase,
      useFactory: findCategoryByIdUseCaseFactory,
      inject: [CATEGORIES_REPOSITORY],
    },
    {
      provide: FindAllCategoriesUseCase,
      useFactory: findAllCategoriesUseCaseFactory,
      inject: [CATEGORIES_REPOSITORY],
    },
    {
      provide: UpdateCategoryUseCase,
      useFactory: updateCategoryUseCaseFactory,
      inject: [CATEGORIES_REPOSITORY],
    },
    {
      provide: DeleteCategoryUseCase,
      useFactory: deleteCategoryUseCaseFactory,
      inject: [CATEGORIES_REPOSITORY],
    },
    {
      provide: ActivateCategoryUseCase,
      useFactory: activateCategoryUseCaseFactory,
      inject: [CATEGORIES_REPOSITORY],
    },
    {
      provide: DeactivateCategoryUseCase,
      useFactory: deactivateCategoryUseCaseFactory,
      inject: [CATEGORIES_REPOSITORY],
    },
  ],
})
export class CategoryServiceModule {}
