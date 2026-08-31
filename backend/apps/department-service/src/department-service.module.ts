import { Module } from '@nestjs/common';
import { DepartmentsController } from './presentation/public/departments/departments.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Department } from './infrastructure/entities/department.entity';
import { JwtModule } from '@nestjs/jwt';
import { DEPARTMENTS_REPOSITORY } from './domain/repositories/departments.repository';
import { MikroDepartmentsRepository } from './infrastructure/repositories/mikro-departments.repository';
import {
  CreateDepartmentUseCase,
  createDepartmentUseCaseFactory,
} from './application/use-cases/create-department/create-department.use-case';
import { UpdateDepartmentUseCase } from './application/use-cases/update-department/update-department.use-case';
import {
  DeactivateDepartmentUseCase,
  deactivateDepartmentUseCaseFactory,
} from './application/use-cases/deactivate-department/deactivate-department.use-case';
import {
  ActivateDepartmentUseCase,
  activateDepartmentUseCaseFactory,
} from './application/use-cases/activate-department/activate-department.use-case';
import { InternalDepartmentsController } from './presentation/internal/departments/departments.controller';
import {
  FindAllDepartmentUseCase,
  findAllDepartmentUseCaseFactory,
} from './application/use-cases/find-department/find-all/find-all-department.use-case';
import {
  FindDepartmentByIdUseCase,
  findDepartmentByIdUseCaseFactory,
} from './application/use-cases/find-department/find-by-id/find-department-by-id.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('DEPARTMENT_DB_HOST'),
        port: config.get<number>('DEPARTMENT_DB_PORT'),
        user: config.get<string>('DEPARTMENT_DB_USER'),
        password: config.get<string>('DEPARTMENT_DB_PASSWORD'),
        dbName: config.get<string>('DEPARTMENT_DB_NAME'),
        entities: [Department],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Department]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DepartmentsController, InternalDepartmentsController],
  providers: [
    { provide: DEPARTMENTS_REPOSITORY, useClass: MikroDepartmentsRepository },
    {
      provide: CreateDepartmentUseCase,
      useFactory: createDepartmentUseCaseFactory,
      inject: [DEPARTMENTS_REPOSITORY],
    },
    {
      provide: FindAllDepartmentUseCase,
      useFactory: findAllDepartmentUseCaseFactory,
      inject: [DEPARTMENTS_REPOSITORY],
    },
    {
      provide: FindDepartmentByIdUseCase,
      useFactory: findDepartmentByIdUseCaseFactory,
      inject: [DEPARTMENTS_REPOSITORY],
    },
    UpdateDepartmentUseCase,
    {
      provide: DeactivateDepartmentUseCase,
      useFactory: deactivateDepartmentUseCaseFactory,
      inject: [DEPARTMENTS_REPOSITORY],
    },
    {
      provide: ActivateDepartmentUseCase,
      useFactory: activateDepartmentUseCaseFactory,
      inject: [DEPARTMENTS_REPOSITORY],
    },
  ],
})
export class DepartmentServiceModule {}
