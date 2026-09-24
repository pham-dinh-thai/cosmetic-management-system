import { Module } from '@nestjs/common';
import { AuditClientModule } from '@app/audit-client';
import { AuthUser } from './infrastructure/entities/auth-user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import {
  CreateAuthUserUseCase,
  createAuthUserUseCaseFactory,
} from './application/use-cases/create-auth-user/create-auth-user.use-case';
import {
  DeleteAuthUserUseCase,
  deleteAuthUserUseCaseFactory,
} from './application/use-cases/delete-auth-user/delete-auth-user.use-case';
import { JwtModule } from '@nestjs/jwt';
import { SIGN_TOKEN_PORT } from './application/ports/sign-token.port';
import { SignTokenAdapter } from './infrastructure/adapters/sign-token.adapter';
import {
  LoginUseCase,
  loginUseCaseFactory,
} from './application/use-cases/login/login.use-case';
import {
  RefreshTokenUseCase,
  refreshTokenUseCaseFactory,
} from './application/use-cases/refresh-token/refresh-token.use-case';
import { AuthUsersController } from './presentation/public/auth-users/auth-users.controller';
import { InternalAuthUsersController } from './presentation/internal/auth-users/auth-users.controller';
import { CREATE_USER_PORT } from './application/use-cases/register/ports/create-user.port';
import { CreateUserAdapter } from './infrastructure/adapters/create-user.adapter';
import { CREATE_CUSTOMER_PORT } from './application/use-cases/register/ports/create-customer.port';
import { CreateCustomerAdapter } from './infrastructure/adapters/create-customer.adapter';
import {
  RegisterUseCase,
  registerUseCaseFactory,
} from './application/use-cases/register/register.use-case';
import { EMPLOYEE_PERMISSION_READER_PORT } from './application/ports/employee-permission-reader.port';
import { EmployeePermissionReaderAdapter } from './infrastructure/adapters/employee-permission-reader.adapter';
import { DEPARTMENT_PERMISSION_READER_PORT } from './application/ports/department-permission-reader.port';
import { DepartmentPermissionReaderAdapter } from './infrastructure/adapters/department-permission-reader.adapter';
import {
  ChangePasswordUseCase,
  changePasswordUseCaseFactory,
} from './application/use-cases/change-password/change-password.use-case';
import { AUTH_USERS_REPOSITORY } from './domain/repositories/auth-users.repository';
import { MikroAuthUsersRepository } from './infrastructure/repositories/mikro-auth-users.repository';
import { FIND_USER_BY_ID_PORT } from './application/ports/find-user-by-id.port';
import { FindUserByIdAdapter } from './infrastructure/adapters/find-user-by-id.adapter';
import { FIND_USER_BY_EMAIL_PORT } from './application/ports/find-user-by-email.port';
import { FindUserByEmailAdapter } from './infrastructure/adapters/find-user-by-email.adapter';
import {
  PermissionResolver,
  permissionResolverFactory,
} from './application/services/permission.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    AuditClientModule,
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('AUTH_DB_HOST'),
        port: config.get<number>('AUTH_DB_PORT'),
        user: config.get<string>('AUTH_DB_USER'),
        password: config.get<string>('AUTH_DB_PASSWORD'),
        dbName: config.get<string>('AUTH_DB_NAME'),
        entities: [AuthUser],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([AuthUser]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthUsersController, InternalAuthUsersController],
  providers: [
    {
      provide: FIND_USER_BY_EMAIL_PORT,
      useClass: FindUserByEmailAdapter,
    },
    {
      provide: AUTH_USERS_REPOSITORY,
      useClass: MikroAuthUsersRepository,
    },
    {
      provide: SIGN_TOKEN_PORT,
      useClass: SignTokenAdapter,
    },
    {
      provide: CreateAuthUserUseCase,
      useFactory: createAuthUserUseCaseFactory,
      inject: [AUTH_USERS_REPOSITORY, FIND_USER_BY_ID_PORT],
    },
    {
      provide: DeleteAuthUserUseCase,
      useFactory: deleteAuthUserUseCaseFactory,
      inject: [AUTH_USERS_REPOSITORY],
    },
    {
      provide: LoginUseCase,
      useFactory: loginUseCaseFactory,
      inject: [
        FIND_USER_BY_EMAIL_PORT,
        AUTH_USERS_REPOSITORY,
        SIGN_TOKEN_PORT,
        PermissionResolver,
      ],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: refreshTokenUseCaseFactory,
      inject: [SIGN_TOKEN_PORT, FIND_USER_BY_ID_PORT, PermissionResolver],
    },
    {
      provide: PermissionResolver,
      useFactory: permissionResolverFactory,
      inject: [
        EMPLOYEE_PERMISSION_READER_PORT,
        DEPARTMENT_PERMISSION_READER_PORT,
      ],
    },
    {
      provide: CREATE_USER_PORT,
      useClass: CreateUserAdapter,
    },
    {
      provide: CREATE_CUSTOMER_PORT,
      useClass: CreateCustomerAdapter,
    },
    {
      provide: RegisterUseCase,
      useFactory: registerUseCaseFactory,
      inject: [
        FIND_USER_BY_EMAIL_PORT,
        CREATE_USER_PORT,
        CREATE_CUSTOMER_PORT,
        SIGN_TOKEN_PORT,
      ],
    },
    {
      provide: ChangePasswordUseCase,
      useFactory: changePasswordUseCaseFactory,
      inject: [AUTH_USERS_REPOSITORY],
    },
    {
      provide: EMPLOYEE_PERMISSION_READER_PORT,
      useClass: EmployeePermissionReaderAdapter,
    },
    {
      provide: DEPARTMENT_PERMISSION_READER_PORT,
      useClass: DepartmentPermissionReaderAdapter,
    },
    {
      provide: FIND_USER_BY_ID_PORT,
      useClass: FindUserByIdAdapter,
    },
  ],
})
export class AuthenticationServiceModule {}
