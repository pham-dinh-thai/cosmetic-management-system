import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { JwtModule } from '@nestjs/jwt';
import { Employee } from './infrastructure/entities/employee.entity';
import { EmployeesController } from './presentation/public/employees/employees.controller';
import { CREATE_USER_PORT } from './application/ports/create-user.port';
import { CreateUserAdapter } from './infrastructure/adapters/create-user.adapter';
import { EMPLOYEES_REPOSITORY } from './domain/repositories/employees.repository';
import { MikroEmployeesRepository } from './infrastructure/repositories/mikro-employees.repository';
import { CreateEmployeeUseCase } from './application/use-cases/create-employee/create-employee.use-case';
import { DEPARTMENTS_READER_PORT } from './domain/ports/departments-reader.port';
import { ReadDepartmentAdapter } from './infrastructure/adapters/departments-reader.adapter';
import { EnsureDepartmentExistsService } from './domain/services/ensure-department-exists.service';

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
  controllers: [EmployeesController],
  providers: [
    {
      provide: CREATE_USER_PORT,
      useFactory: (config: ConfigService) => new CreateUserAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: DEPARTMENTS_READER_PORT,
      useFactory: (config: ConfigService) => new ReadDepartmentAdapter(config),
      inject: [ConfigService],
    },
    { provide: EMPLOYEES_REPOSITORY, useClass: MikroEmployeesRepository },
    EnsureDepartmentExistsService,
    CreateEmployeeUseCase,
  ],
})
export class EmployeeServiceModule {}
