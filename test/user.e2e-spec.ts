import { BadRequestException, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { App } from "supertest/types";
import request from "supertest"
import { faker } from '@faker-js/faker';

describe("mutation module (e2e)", () => {

    let app: INestApplication<App>;
    let jwt: string;

    let sessional_jwt: string;

    let name: string;
    let current_email: string;
    let current_password: string;

    let new_email: string;
    let new_password: string;

    let invalid_password: string;

    beforeAll(async () => {
        name = faker.person.fullName()
        current_email = faker.internet.email()
        current_password = [faker.string.alpha({ length: 1, casing: 'upper' }), faker.string.alpha({ length: 1, casing: 'lower' }), faker.string.numeric({ length: 1 }), faker.string.symbol(), faker.string.alphanumeric({ length: 4 })].join("")

        new_email = faker.internet.email()
        new_password = [faker.string.alpha({ length: 1, casing: 'upper' }), faker.string.alpha({ length: 1, casing: 'lower' }), faker.string.numeric({ length: 1 }), faker.string.symbol(), faker.string.alphanumeric({ length: 4 })].join("")

        invalid_password = [faker.string.alpha({ length: 1, casing: 'upper' }), faker.string.alpha({ length: 1, casing: 'lower' }), faker.string.numeric({ length: 1 }), faker.string.symbol(), faker.string.alphanumeric({ length: 4 })].join("")

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

        const response = await request(app.getHttpServer()).post("/api/auth/login").send({
            email: "tsaqifradhitya@gmail.com",
            password: "Tsaqif10!"
        })
        jwt = response.body.data.access_token

        await request(app.getHttpServer()).post("/api/auth/register").send({
            name: name,
            email: current_email,
            password: current_password,
            confirm_password: current_password
        })

        const response_2 = await request(app.getHttpServer()).post("/api/auth/login").send({
            email: current_email,
            password: current_password
        })

        sessional_jwt = response_2.body.data.access_token
    })

    afterAll(async () => {
        await request(app.getHttpServer()).post("/api/auth/logout").set('Authorization' as any, `Bearer ${jwt}`)
        app.close()
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
        const response = await request(app.getHttpServer()).patch("/api/user").set('Authorization' as any, `Bearer ${sessional_jwt}`).send({
            email: new_email
        })
        expect(response.status).toBe(200)
    })

    it('/api/user (PATCH) 400', async () => {
        const response = await request(app.getHttpServer()).patch("/api/user").set('Authorization' as any, `Bearer ${sessional_jwt}`).send({
            email: "sdaadad"
        })
        expect(response.status).toBe(400)
    })

    it('/api/user (PATCH) 400 (all field empty)', async () => {
        const response = await request(app.getHttpServer()).patch("/api/user").set('Authorization' as any, `Bearer ${sessional_jwt}`)
        expect(response.status).toBe(400)
    })

    it('/api/user (PATCH) 401', async () => {
        const response = await request(app.getHttpServer()).patch("/api/user")
        expect(response.status).toBe(401)
    })

    it('/api/user/update_password (POST) 400 condition', async () => {
        const response = await request(app.getHttpServer()).put("/api/user/update_password").set('Authorization' as any, `Bearer ${sessional_jwt}`)
        expect(response.status).toBe(400)
    })

    it('/api/user/update_password (POST) 401 condition invalid current_password', async () => {
        const response = await request(app.getHttpServer()).put("/api/user/update_password").set('Authorization' as any, `Bearer ${sessional_jwt}`).send({
            current_password: invalid_password,
            new_password: new_password,
            confirm_new_password: new_password
        })
        expect(response.status).toBe(401)
    })

    it('/api/user/update_password (POST) 200 condition', async () => {
        const response = await request(app.getHttpServer()).put("/api/user/update_password").set('Authorization' as any, `Bearer ${sessional_jwt}`).send({
            current_password: current_password,
            new_password: new_password,
            confirm_new_password: new_password
        })
        expect(response.status).toBe(200)
    })

    it('/api/user/update_password (POST) 400 condition (new password same with old password)', async () => {
        const response = await request(app.getHttpServer()).put("/api/user/update_password").set('Authorization' as any, `Bearer ${sessional_jwt}`).send({
            current_password: new_password,
            new_password: new_password,
            confirm_new_password: new_password
        })
        expect(response.status).toBe(400)
    })

    it('/api/user/update_password (POST) 401 condition', async () => {
        const response = await request(app.getHttpServer()).put("/api/user/update_password")
        expect(response.status).toBe(401)
    })
})