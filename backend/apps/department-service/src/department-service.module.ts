import { Module } from '@nestjs/common';
import { DepartmentsController } from './presentation/public/departments/departments.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Department } from './infrastructure/entities/department.entity';
import { UuidModule } from 'nestjs-uuid';
import { JwtModule } from '@nestjs/jwt';
import { DEPARTMENTS_REPOSITORY } from './domain/repositories/departments.repository';
import { MikroDepartmentsRepository } from './infrastructure/repositories/mikro-departments.repository';
import { CREATE_DEPARTMENT_ID_PORT } from './application/ports/create-department-id.port';
import { CreateDepartmentUuidAdapter } from './infrastructure/adapters/create-department-uuid.adapter';
import { CreateDepartmentUseCase } from './application/use-cases/create-department/create-department.use-case';
import { FindDepartmentsUseCase } from './application/use-cases/find-departments/find-departments.use-case';
import { DepartmentUniquenessService } from './domain/services/department-uniqueness.service';

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
    UuidModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DepartmentsController],
  providers: [
    { provide: DEPARTMENTS_REPOSITORY, useClass: MikroDepartmentsRepository },
    {
      provide: CREATE_DEPARTMENT_ID_PORT,
      useClass: CreateDepartmentUuidAdapter,
    },
    CreateDepartmentUseCase,
    FindDepartmentsUseCase,
    DepartmentUniquenessService,
  ],
})
export class DepartmentServiceModule {}
