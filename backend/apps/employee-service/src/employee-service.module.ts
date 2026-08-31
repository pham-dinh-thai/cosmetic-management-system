import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { JwtModule } from '@nestjs/jwt';
import { Employee } from './infrastructure/entities/employee.entity';
import { EmployeesController } from './presentation/public/employees/employees.controller';
import { InternalEmployeesController } from './presentation/internal/employees/employees.controller';
import { CREATE_USER_PORT } from './application/use-cases/create-employee/ports/create-user.port';
import { CreateUserAdapter } from './infrastructure/adapters/create-user.adapter';
import { EMPLOYEES_REPOSITORY } from './domain/repositories/employees.repository';
import { MikroEmployeesRepository } from './infrastructure/repositories/mikro-employees.repository';
import {
  createEmployeeUseCaseFactory,
  CreateEmployeeUseCase,
} from './application/use-cases/create-employee/create-employee.use-case';
import { DEPARTMENTS_READER_PORT } from './application/ports/departments-reader.port';
import { DepartmentsReaderAdapter } from './infrastructure/adapters/departments-reader.adapter';
import { UPDATE_USER_INFORMATION_PORT } from './application/use-cases/update-employee-information/ports/update-user-information.port';
import { UpdateUserInformationAdapter } from './infrastructure/adapters/update-user-information.adapter';
import { FIND_USER_INFORMATION_PORT } from './application/use-cases/update-employee-information/ports/find-user-information.port';
import { FindUserInformationAdapter } from './infrastructure/adapters/find-user-information.adapter';
import {
  EMPLOYEE_LOGGER_PORT,
  type IEmployeeLoggerPort,
} from './application/ports/employee-logger.port';
import { NestJSLoggerAdapter } from './infrastructure/adapters/nestjs-logger.adapter';
import {
  updateEmployeeInformationUseCaseFactory,
  UpdateEmployeeInformationUseCase,
} from './application/use-cases/update-employee-information/update-employee-information.use-case';
import { DELETE_USER_PORT } from './application/use-cases/delete-employee/ports/delete-user.port';
import { DeleteUserAdapter } from './infrastructure/adapters/delete-user.adapter';
import {
  deleteEmployeeUseCaseFactory,
  DeleteEmployeeUseCase,
} from './application/use-cases/delete-employee/delete-employee.use-case';
import {
  AssignDepartmentToEmployeeUseCase,
  assignDepartmentToEmployeeUseCaseFactory,
} from './application/use-cases/assign-department-to-employee/assign-department-to-employee.use-case';
import {
  UpdateEmployeePositionUseCase,
  updateEmployeePositionUseCaseFactory,
} from './application/use-cases/update-employee-position/update-employee-position.use-case';
import {
  FindEmployeeByIdUseCase,
  findEmployeeByIdUseCaseFactory,
} from './application/use-cases/find-employee/find-by-id/find-employee-by-id.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../.env', isGlobal: true }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('EMPLOYEE_DB_HOST'),
        port: config.get<number>('EMPLOYEE_DB_PORT'),
        user: config.get<string>('EMPLOYEE_DB_USER'),
        password: config.get<string>('EMPLOYEE_DB_PASSWORD'),
        dbName: config.get<string>('EMPLOYEE_DB_NAME'),
        entities: [Employee],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Employee]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EmployeesController, InternalEmployeesController],
  providers: [
    {
      provide: CREATE_USER_PORT,
      useFactory: (config: ConfigService, logger: IEmployeeLoggerPort) =>
        new CreateUserAdapter(logger, config),
      inject: [ConfigService, EMPLOYEE_LOGGER_PORT],
    },
    {
      provide: DEPARTMENTS_READER_PORT,
      useFactory: (config: ConfigService) =>
        new DepartmentsReaderAdapter(config),
      inject: [ConfigService],
    },
    { provide: EMPLOYEES_REPOSITORY, useClass: MikroEmployeesRepository },
    {
      provide: CreateEmployeeUseCase,
      useFactory: createEmployeeUseCaseFactory,
      inject: [CREATE_USER_PORT, EMPLOYEES_REPOSITORY, DEPARTMENTS_READER_PORT],
    },
    {
      provide: UPDATE_USER_INFORMATION_PORT,
      useFactory: (config: ConfigService, logger: IEmployeeLoggerPort) =>
        new UpdateUserInformationAdapter(logger, config),
      inject: [ConfigService, EMPLOYEE_LOGGER_PORT],
    },
    {
      provide: FIND_USER_INFORMATION_PORT,
      useFactory: (config: ConfigService, logger: IEmployeeLoggerPort) =>
        new FindUserInformationAdapter(logger, config),
      inject: [ConfigService, EMPLOYEE_LOGGER_PORT],
    },
    {
      provide: DELETE_USER_PORT,
      useFactory: (config: ConfigService, logger: IEmployeeLoggerPort) =>
        new DeleteUserAdapter(logger, config),
      inject: [ConfigService, EMPLOYEE_LOGGER_PORT],
    },
    {
      provide: EMPLOYEE_LOGGER_PORT,
      useFactory: () => new NestJSLoggerAdapter(),
    },
    {
      provide: UpdateEmployeeInformationUseCase,
      useFactory: updateEmployeeInformationUseCaseFactory,
      inject: [
        EMPLOYEES_REPOSITORY,
        UPDATE_USER_INFORMATION_PORT,
        FIND_USER_INFORMATION_PORT,
        EMPLOYEE_LOGGER_PORT,
      ],
    },
    {
      provide: AssignDepartmentToEmployeeUseCase,
      useFactory: assignDepartmentToEmployeeUseCaseFactory,
      inject: [EMPLOYEES_REPOSITORY, DEPARTMENTS_READER_PORT],
    },
    {
      provide: DeleteEmployeeUseCase,
      useFactory: deleteEmployeeUseCaseFactory,
      inject: [EMPLOYEES_REPOSITORY, DELETE_USER_PORT, EMPLOYEE_LOGGER_PORT],
    },
    {
      provide: UpdateEmployeePositionUseCase,
      useFactory: updateEmployeePositionUseCaseFactory,
      inject: [EMPLOYEES_REPOSITORY],
    },
    {
      provide: FindEmployeeByIdUseCase,
      useFactory: findEmployeeByIdUseCaseFactory,
      inject: [EMPLOYEES_REPOSITORY],
    },
  ],
})
export class EmployeeServiceModule {}
