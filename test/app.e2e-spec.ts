import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user (GET)', async () => {
    const response = await request(app.getHttpServer()).get("/user")
    expect(response.status).toBe(200)
    expect(response.body[0]).toHaveProperty("id")
    expect(response.body[0]).toHaveProperty("name")
    expect(response.body[0]).toHaveProperty("email")
    expect(response.body[0]).toHaveProperty("password")
    expect(response.body[0]).toHaveProperty("created_at")
    expect(response.body[0]).toHaveProperty("updated_at")
  })
});
