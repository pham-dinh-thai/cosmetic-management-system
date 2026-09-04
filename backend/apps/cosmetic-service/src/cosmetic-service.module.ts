import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Cosmetic } from './infrastructure/entities/cosmetic.entity';
import { CosmeticVariant } from './infrastructure/entities/cosmetic-variant.entity';
import { CosmeticCategory } from './infrastructure/entities/cosmetic-category.entity';
import { CosmeticsController } from './presentation/public/cosmetics/cosmetics.controller';
import { COSMETICS_REPOSITORY } from './domain/repositories/cosmetics.repository';
import { MikroCosmeticsRepository } from './infrastructure/repositories/mikro-cosmetics.repository';
import {
  CreateCosmeticUseCase,
  createCosmeticUseCaseFactory,
} from './application/use-cases/create-cosmetic/create-cosmetic.use-case';
import {
  FindCosmeticByIdUseCase,
  findCosmeticByIdUseCaseFactory,
} from './application/use-cases/find-cosmetic/find-by-id/find-cosmetic-by-id.use-case';
import {
  FindAllCosmeticsUseCase,
  findAllCosmeticsUseCaseFactory,
} from './application/use-cases/find-cosmetic/find-all/find-all-cosmetics.use-case';
import {
  UpdateCosmeticUseCase,
  updateCosmeticUseCaseFactory,
} from './application/use-cases/update-cosmetic/update-cosmetic.use-case';
import {
  ActivateCosmeticUseCase,
  activateCosmeticUseCaseFactory,
} from './application/use-cases/activate-cosmetic/activate-cosmetic.use-case';
import {
  DeactivateCosmeticUseCase,
  deactivateCosmeticUseCaseFactory,
} from './application/use-cases/deactivate-cosmetic/deactivate-cosmetic.use-case';
import {
  DeleteCosmeticUseCase,
  deleteCosmeticUseCaseFactory,
} from './application/use-cases/delete-cosmetic/delete-cosmetic.use-case';
import {
  AddVariantUseCase,
  addVariantUseCaseFactory,
} from './application/use-cases/add-variant/add-variant.use-case';
import {
  UpdateVariantUseCase,
  updateVariantUseCaseFactory,
} from './application/use-cases/update-variant/update-variant.use-case';
import {
  ActivateVariantUseCase,
  activateVariantUseCaseFactory,
} from './application/use-cases/activate-variant/activate-variant.use-case';
import {
  DeactivateVariantUseCase,
  deactivateVariantUseCaseFactory,
} from './application/use-cases/deactivate-variant/deactivate-variant.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('COSMETIC_DB_HOST'),
        port: config.get<number>('COSMETIC_DB_PORT'),
        user: config.get<string>('COSMETIC_DB_USER'),
        password: config.get<string>('COSMETIC_DB_PASSWORD'),
        dbName: config.get<string>('COSMETIC_DB_NAME'),
        entities: [Cosmetic, CosmeticVariant, CosmeticCategory],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Cosmetic, CosmeticVariant, CosmeticCategory]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CosmeticsController],
  providers: [
    { provide: COSMETICS_REPOSITORY, useClass: MikroCosmeticsRepository },
    {
      provide: CreateCosmeticUseCase,
      useFactory: createCosmeticUseCaseFactory,
      inject: [COSMETICS_REPOSITORY],
    },
    {
      provide: FindCosmeticByIdUseCase,
      useFactory: findCosmeticByIdUseCaseFactory,
      inject: [COSMETICS_REPOSITORY],
    },
    {
      provide: FindAllCosmeticsUseCase,
      useFactory: findAllCosmeticsUseCaseFactory,
      inject: [COSMETICS_REPOSITORY],
    },
    {
      provide: UpdateCosmeticUseCase,
      useFactory: updateCosmeticUseCaseFactory,
      inject: [COSMETICS_REPOSITORY],
    },
    {
      provide: ActivateCosmeticUseCase,
      useFactory: activateCosmeticUseCaseFactory,
      inject: [COSMETICS_REPOSITORY],
    },
    {
      provide: DeactivateCosmeticUseCase,
      useFactory: deactivateCosmeticUseCaseFactory,
      inject: [COSMETICS_REPOSITORY],
    },
    {
      provide: DeleteCosmeticUseCase,
      useFactory: deleteCosmeticUseCaseFactory,
      inject: [COSMETICS_REPOSITORY],
    },
    {
      provide: AddVariantUseCase,
      useFactory: addVariantUseCaseFactory,
      inject: [COSMETICS_REPOSITORY],
    },
    {
      provide: UpdateVariantUseCase,
      useFactory: updateVariantUseCaseFactory,
      inject: [COSMETICS_REPOSITORY],
    },
    {
      provide: ActivateVariantUseCase,
      useFactory: activateVariantUseCaseFactory,
      inject: [COSMETICS_REPOSITORY],
    },
    {
      provide: DeactivateVariantUseCase,
      useFactory: deactivateVariantUseCaseFactory,
      inject: [COSMETICS_REPOSITORY],
    },
  ],
})
export class CosmeticServiceModule {}
