import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EmployeeServiceModule } from './../src/employee-service.module';

describe('EmployeeServiceController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EmployeeServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/employees (POST) - should require auth', () => {
    return request(app.getHttpServer())
      .post('/api/employees')
      .send({})
      .expect(401);
  });
});
