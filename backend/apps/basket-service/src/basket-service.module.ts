import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { JwtModule } from '@nestjs/jwt';
import { Cart } from './infrastructure/entities/cart.entity';
import { CartItem } from './infrastructure/entities/cart-item.entity';
import { CARTS_REPOSITORY } from './domain/repositories/carts.repository';
import { MikroCartsRepository } from './infrastructure/repositories/mikro-carts.repository';
import { CUSTOMER_READER_PORT } from './application/ports/customer-reader.port';
import { CustomerReaderAdapter } from './infrastructure/adapters/customer-reader.adapter';
import { VARIANT_READER_PORT } from './application/ports/variant-reader.port';
import { VariantReaderAdapter } from './infrastructure/adapters/variant-reader.adapter';
import { CREATE_ORDER_PORT } from './application/ports/create-order.port';
import { CreateOrderAdapter } from './infrastructure/adapters/create-order.adapter';
import {
  GetCartUseCase,
  getCartUseCaseFactory,
} from './application/use-cases/get-cart/get-cart.use-case';
import {
  AddCartItemUseCase,
  addCartItemUseCaseFactory,
} from './application/use-cases/add-cart-item/add-cart-item.use-case';
import {
  UpdateCartItemUseCase,
  updateCartItemUseCaseFactory,
} from './application/use-cases/update-cart-item/update-cart-item.use-case';
import {
  RemoveCartItemUseCase,
  removeCartItemUseCaseFactory,
} from './application/use-cases/remove-cart-item/remove-cart-item.use-case';
import {
  CheckoutUseCase,
  checkoutUseCaseFactory,
} from './application/use-cases/checkout/checkout.use-case';
import { BasketsController } from './presentation/public/baskets/baskets.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('BASKET_DB_HOST'),
        port: config.get<number>('BASKET_DB_PORT'),
        user: config.get<string>('BASKET_DB_USER'),
        password: config.get<string>('BASKET_DB_PASSWORD'),
        dbName: config.get<string>('BASKET_DB_NAME'),
        entities: [Cart, CartItem],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Cart, CartItem]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BasketsController],
  providers: [
    { provide: CARTS_REPOSITORY, useClass: MikroCartsRepository },
    { provide: CUSTOMER_READER_PORT, useClass: CustomerReaderAdapter },
    { provide: VARIANT_READER_PORT, useClass: VariantReaderAdapter },
    { provide: CREATE_ORDER_PORT, useClass: CreateOrderAdapter },
    {
      provide: GetCartUseCase,
      useFactory: getCartUseCaseFactory,
      inject: [CARTS_REPOSITORY, CUSTOMER_READER_PORT, VARIANT_READER_PORT],
    },
    {
      provide: AddCartItemUseCase,
      useFactory: addCartItemUseCaseFactory,
      inject: [CARTS_REPOSITORY, CUSTOMER_READER_PORT, VARIANT_READER_PORT],
    },
    {
      provide: UpdateCartItemUseCase,
      useFactory: updateCartItemUseCaseFactory,
      inject: [CARTS_REPOSITORY, CUSTOMER_READER_PORT],
    },
    {
      provide: RemoveCartItemUseCase,
      useFactory: removeCartItemUseCaseFactory,
      inject: [CARTS_REPOSITORY, CUSTOMER_READER_PORT],
    },
    {
      provide: CheckoutUseCase,
      useFactory: checkoutUseCaseFactory,
      inject: [
        CARTS_REPOSITORY,
        CUSTOMER_READER_PORT,
        VARIANT_READER_PORT,
        CREATE_ORDER_PORT,
      ],
    },
  ],
})
export class BasketServiceModule {}
