import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
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
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      exceptionFactory(errors) {
        const formattedErrors = {}

        errors.forEach((error) => {
          if (error.constraints) {
            formattedErrors[error.property] = Object.values(error.constraints)[0];
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
          status: 400,
          message: 'validation exception',
          error: formattedErrors,
        });
      },
    }))
    app.setGlobalPrefix('api')
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let jwt: string;

  it("/api/auth/login (POST) 200 condition", async () => {
    const response = await request(app.getHttpServer()).post("/api/auth/login").send({
      email: "tsaqifradhitya@gmail.com",
      password: "Tsaqif10!"
    })
    expect(response.status).toBe(200)
    expect(response.body.data).toHaveProperty("access_token")
    jwt = response.body.data.access_token
  })

  it("/api/auth/login (POST) 400 condition", async () => {
    const response = await request(app.getHttpServer()).post("/api/auth/login").send({})
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("status")
    expect(response.body).toHaveProperty("message")
    expect(response.body).toHaveProperty("error")
    expect(typeof response.body.error).toEqual("object")
  })

  it("/api/auth/login (POST) 401 condition", async () => {
    const response = await request(app.getHttpServer()).post("/api/auth/login").send({
      email: "user@gmail.com",
      password: "userPassword123!"
    })
    expect(response.status).toBe(401)
  })

  it('/api/auth/register (POST) 200 condition', async () => {
    const response = await request(app.getHttpServer()).post("/api/auth/register").send({
      name: "Tsaqif",
      email: "tsaqifradhitya@gmail.com",
      password: "Tsaqif10!",
      confirm_password: "Tsaqif10!"
    })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("status")
    expect(response.body).toHaveProperty("message")
    expect(response.body).toHaveProperty("data")
    expect(typeof response.body.data).toEqual("object")
  })

  it('/api/auth/register (POST) 400 condition', async () => {
    const response = await request(app.getHttpServer()).post("/api/auth/register")
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("status")
    expect(response.body).toHaveProperty("message")
    expect(response.body).toHaveProperty("error")
    expect(typeof response.body.error).toEqual("object")
  })

  it("/api/auth/activate_account (POST) 200 condition", async () => {

  })

  it("/api/auth/activate_account (POST) 400 condition", async () => {
    const response = await request(app.getHttpServer()).post("/api/auth/activate_account")
    expect(response.status).toBe(400)
  })

  it("/api/auth/activate_account (POST) 401 condition", async () => {

  })

  it("/api/auth/disable_account (POST) 200 condition", async () => {

  })

  it("/api/auth/disable_account (POST) 401 condition", async () => {
    const response = await request(app.getHttpServer()).delete("/api/auth/disable_account")
    expect(response.status).toBe(401)
  })

  it('/api/user (GET) 200 condition', async () => {
    const response = await request(app.getHttpServer()).get("/api/user").set('Authorization' as any, `Bearer ${jwt}`)
    expect(response.status).toBe(200)
  })

  it('/api/user (GET) 401 condition', async () => {
    const response = await request(app.getHttpServer()).get("/api/user")
    expect(response.status).toBe(401)
  })

  it('/api/user/saldo (GET) 200 condition', async () => {
    const response = await request(app.getHttpServer()).get("/api/user/saldo").set('Authorization' as any, `Bearer ${jwt}`)
    expect(response.status).toBe(200)
    expect(typeof response.body.data.saldo === "number").toBe(true)
  })

  it('/api/user/saldo (GET) 401 condition', async () => {
    const response = await request(app.getHttpServer()).get("/api/user/saldo")
    expect(response.status).toBe(401)
  })

  it('/api/user (PATCH) 200 condition', async () => {

  })

  it('/api/user (PATCH) 400', async () => {

  })

  it('/api/user (PATCH) 401', async () => {
    const response = await request(app.getHttpServer()).patch("/api/user")
    expect(response.status).toBe(401)
  })

  it('/api/user/update_password (POST) 200 condition', async () => {

  })

  it('/api/user/update_password (POST) 400 condition', async () => {

  })

  it('/api/user/update_password (POST) 400 condition (new password same with old password)', async () => {

  })

  it('/api/user/update_password (POST) 401 condition', async () => {
    const response = await request(app.getHttpServer()).post("/api/user/update_password")
    expect(response.status).toBe(401)
  })

  it("/api/mutation (POST) 200 condition", async () => {

  })

  it("/api/mutation (POST) 400 condition", async () => {
    const response = await request(app.getHttpServer()).post("/api/mutation").set('Authorization' as any, `Bearer ${jwt}`)
    expect(response.status).toBe(400)
  })

  it("/api/mutation (POST) 401 condition", async () => {
    const response = await request(app.getHttpServer()).post("/api/mutation")
    expect(response.status).toBe(401)
  })

  it("/api/mutation (GET) 200 condition", async () => {
    const response = await request(app.getHttpServer()).get("/api/mutation").set('Authorization' as any, `Bearer ${jwt}`)
    expect(response.status).toBe(200)
  })

  it("/api/mutation (GET) 401 condition", async () => {
    const response = await request(app.getHttpServer()).get("/api/mutation")
    expect(response.status).toBe(401)
  })

  it("/api/mutation/:id (GET) 200 condition", async () => {
    const response = await request(app.getHttpServer()).get("/api/mutation/1").set('Authorization' as any, `Bearer ${jwt}`)
    expect(response.status).toBe(200)
  })

  it("/api/mutation/:id (GET) 404 condition", async () => {
    const response = await request(app.getHttpServer()).get("/api/mutation/100").set('Authorization' as any, `Bearer ${jwt}`)
    expect(response.status).toBe(404)
  })

  it("/api/mutation/:id (GET) 401 condition", async () => {
    const response = await request(app.getHttpServer()).get("/api/mutation/1")
    expect(response.status).toBe(401)
  })

  it("/api/auth/logout (POST) condition 200", async () => {
    const response = await request(app.getHttpServer()).post("/api/auth/logout").set('Authorization' as any, `Bearer ${jwt}`)
    expect(response.status).toBe(200)
  })

  it("/api/auth/logout (POST) condition 401", async () => {
    const response = await request(app.getHttpServer()).post("/api/auth/logout")
    expect(response.status).toBe(401)
  })
});
