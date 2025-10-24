import { BadRequestException, INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { App } from "supertest/types";
import request from "supertest"
import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";

describe("Auth Module (e2e)", () => {
    let app: INestApplication<App>;
    let name: string;
    let current_email: string;
    let current_password: string;
    let sessional_jwt: string;
    let jwt: string;

    beforeAll(async () => {
        name = faker.person.fullName()
        current_email = faker.internet.email()
        current_password = [faker.string.alpha({ length: 1, casing: 'upper' }), faker.string.alpha({ length: 1, casing: 'lower' }), faker.string.numeric({ length: 1 }), faker.string.symbol(), faker.string.alphanumeric({ length: 4 })].join("")
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            whitelist: true,
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
                    statusCode: 400,
                    message: "Bad Request",
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
        expect(response.body).toHaveProperty("statusCode")
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
            name: name,
            email: current_email,
            password: current_password,
            confirm_password: current_password
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("statusCode")
        expect(response.body).toHaveProperty("message")
        expect(response.body).toHaveProperty("data")
        expect(typeof response.body.data).toEqual("object")
    })

    it('/api/auth/register (POST) 400 condition', async () => {
        const response = await request(app.getHttpServer()).post("/api/auth/register")
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("statusCode")
        expect(response.body).toHaveProperty("message")
        expect(response.body).toHaveProperty("error")
        expect(typeof response.body.error).toEqual("object")
    })

    it("/api/auth/login (POST) 200 condition (new account)", async () => {
        const response = await request(app.getHttpServer()).post("/api/auth/login").send({
            email: current_email,
            password: current_password
        })
        expect(response.status).toBe(200)
        expect(response.body.data).toHaveProperty("access_token")
        sessional_jwt = response.body.data.access_token
    })

    it("/api/auth/logout (POST) condition 200", async () => {
        const response = await request(app.getHttpServer()).post("/api/auth/logout").set('Authorization' as any, `Bearer ${jwt}`)
        expect(response.status).toBe(200)
    })

    it("/api/auth/logout (POST) condition 401", async () => {
        const response = await request(app.getHttpServer()).post("/api/auth/logout")
        expect(response.status).toBe(401)
    })

    it("/api/auth/disable_account (POST) 200 condition", async () => {
        const response = await request(app.getHttpServer()).delete("/api/auth/disable_account").set('Authorization' as any, `Bearer ${sessional_jwt}`)
        expect(response.status).toBe(200)
    })

    it("/api/auth/disable_account (POST) 401 condition", async () => {
        const response = await request(app.getHttpServer()).delete("/api/auth/disable_account")
        expect(response.status).toBe(401)
    })

    it("/api/auth/activate_account (POST) 200 condition", async () => {
        const response = await request(app.getHttpServer()).post("/api/auth/activate_account").send({
            email: current_email,
            password: current_password
        })
        expect(response.status).toBe(200)
    })

    it("/api/auth/activate_account (POST) 401 condition", async () => {
        const response = await request(app.getHttpServer()).post("/api/auth/activate_account").send({
            email: current_email,
            password: "Tsaqif10!!"
        })
        expect(response.status).toBe(401)
    })

    it("/api/auth/activate_account (POST) 409 condition", async () => {
        const response = await request(app.getHttpServer()).post("/api/auth/activate_account").send({
            email: current_email,
            password: current_password
        })
        expect(response.status).toBe(409)
    })

    it("/api/auth/activate_account (POST) 400 condition", async () => {
        const response = await request(app.getHttpServer()).post("/api/auth/activate_account")
        expect(response.status).toBe(400)
    })
})