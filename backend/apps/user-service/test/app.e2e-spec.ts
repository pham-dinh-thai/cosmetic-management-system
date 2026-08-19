import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserServiceModule } from './../src/user-service.module';
import { User } from './../src/infrastructure/entities/user.entity';

describe('UserService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /users then GET /users/:id', async () => {
    const email = `e2e-${Date.now()}@test.vn`;
    await request(app.getHttpServer())
      .post('/api/users')
      .send({ email, name: 'E2E', password: '123' })
      .expect(201);

    const user = await app.get(EntityManager).findOne(User, { email });

    expect(user).toBeDefined();
    expect(user?.name).toBe('E2E');

    const found = await request(app.getHttpServer())
      .get(`/api/users/${user?.id}`)
      .expect(200);

    expect(found.body.email).toBe(email);
  });

  it('POST /users rejects duplicate email', async () => {
    const email = `dup-${Date.now()}@test.vn`;
    await request(app.getHttpServer())
      .post('/api/users')
      .send({ email, name: 'A', password: '1' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/users')
      .send({ email, name: 'B', password: '2' })
      .expect(409);
  });
});
