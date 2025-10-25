import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { App } from 'supertest/types';
import { E } from 'node_modules/@faker-js/faker/dist/airline-CLphikKp.cjs';

describe('mutation module (e2e)', () => {
  let app: INestApplication<App>;
  let jwt: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory(errors) {
          const formattedErrors = {};

          errors.forEach((error) => {
            if (error.constraints) {
              formattedErrors[error.property] = Object.values(
                error.constraints,
              );
            }

            if (error.children && error.children.length > 0) {
              error.children.forEach((child) => {
                if (child.constraints) {
                  formattedErrors[`${error.property}.${child.property}`] =
                    Object.values(child.constraints)[0];
                }
              });
            }
          });

          return new BadRequestException({
            statusCode: 400,
            message: 'Bad Request',
            error: formattedErrors,
          });
        },
      }),
    );
    app.setGlobalPrefix('api');
    await app.init();
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'tsaqifradhitya@gmail.com',
        password: 'Tsaqif10!',
      });
    jwt = response.body.data.access_token;
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization' as any, `Bearer ${jwt}`);
    app.close();
  });

  it('/api/mutation (POST) 201 condition', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/mutation')
      .set('Authorization' as any, `Bearer ${jwt}`)
      .send({
        amount: 50000,
        transaction_type: 'deposit',
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('statusCode');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
    const { statusCode, message, data } = response.body;
    expect(statusCode).toBe(201);
    expect(message).toBe('created');
    expect(data).toHaveProperty('amount');
    expect(data).toHaveProperty('transaction_type');
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('created_at');
    expect(data).toHaveProperty('updated_at');
    expect(data).toHaveProperty('user_id');
  });

  it('/api/mutation (POST) 400 condition', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/mutation')
      .set('Authorization' as any, `Bearer ${jwt}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('statusCode');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('error');
    const { statusCode, message, error } = response.body;
    expect(statusCode).toBe(400);
    expect(message).toBe('Bad Request');
    expect(error).toHaveProperty('amount');
    expect(error).toHaveProperty('transaction_type');

    (error.amount as string[]).forEach((err) => {
      expect(typeof err).toBe('string');
    });
    (error.transaction_type as string[]).forEach((err) => {
      expect(typeof err).toBe('string');
    });
  });

  it('/api/mutation (POST) 401 condition', async () => {
    const response = await request(app.getHttpServer()).post('/api/mutation');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('statusCode');
    expect(response.body).toHaveProperty('message');
    const { statusCode, message } = response.body;
    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
  });

  it('/api/mutation (GET) 200 condition', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/mutation?page=1&perpage=10')
      .set('Authorization' as any, `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('statusCode');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('metadata');
    const { statusCode, message, data, metadata } = response.body;
    expect(statusCode).toBe(200);
    expect(message).toBe('ok');
    (data as []).forEach((d) => {
      expect(d).toHaveProperty('id');
      expect(d).toHaveProperty('amount');
      expect(d).toHaveProperty('transaction_type');
      expect(d).toHaveProperty('created_at');
      expect(d).toHaveProperty('updated_at');
    });

    expect(metadata).toHaveProperty('total');
    expect(metadata).toHaveProperty('page');
    expect(metadata).toHaveProperty('next_page');
    expect(metadata).toHaveProperty('prev_page');
    expect(metadata).toHaveProperty('first_page');
    expect(metadata).toHaveProperty('last_page');
    expect(metadata).toHaveProperty('next_page_url');
    expect(metadata).toHaveProperty('prev_page_url');
    expect(metadata).toHaveProperty('last_page_url');
    expect(metadata).toHaveProperty('first_page_url');
  });

  it('/api/mutation (GET) 401 condition', async () => {
    const response = await request(app.getHttpServer()).get('/api/mutation');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('statusCode');
    expect(response.body).toHaveProperty('message');
    const { statusCode, message } = response.body;
    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
  });

  it('/api/mutation/:id (GET) 200 condition', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/mutation/2')
      .set('Authorization' as any, `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('statusCode');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
    const { statusCode, message, data } = response.body;
    expect(statusCode).toBe(200);
    expect(message).toBe('ok');
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('amount');
    expect(data).toHaveProperty('transaction_type');
    expect(data).toHaveProperty('created_at');
    expect(data).toHaveProperty('updated_at');
  });

  it('/api/mutation/:id (GET) 404 condition', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/mutation/100000')
      .set('Authorization' as any, `Bearer ${jwt}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('statusCode');
    expect(response.body).toHaveProperty('message');
    const { statusCode, message } = response.body;
    expect(statusCode).toBe(404);
    expect(message).toBe('Not Found');
  });

  it('/api/mutation/:id (GET) 401 condition', async () => {
    const response = await request(app.getHttpServer()).get('/api/mutation/1');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('statusCode');
    expect(response.body).toHaveProperty('message');
    const { statusCode, message } = response.body;
    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
  });
});
