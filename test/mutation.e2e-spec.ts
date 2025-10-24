import { BadRequestException, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import request from "supertest"
import { App } from "supertest/types";

describe("mutation module (e2e)", () => {

    let app: INestApplication<App>;
    let jwt: string;

    beforeAll(async () => {
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
    })

    afterAll(async () => {
        await request(app.getHttpServer()).post("/api/auth/logout").set('Authorization' as any, `Bearer ${jwt}`)
        app.close()
    })

    it("/api/mutation (POST) 200 condition", async () => {
        const response = await request(app.getHttpServer()).post("/api/mutation").set('Authorization' as any, `Bearer ${jwt}`).send({
            amount: 50000,
            transaction_type: "deposit"
        })
        expect(response.status).toBe(201)
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
        const response = await request(app.getHttpServer()).get("/api/mutation/2").set('Authorization' as any, `Bearer ${jwt}`)
        expect(response.status).toBe(200)
    })

    it("/api/mutation/:id (GET) 404 condition", async () => {
        const response = await request(app.getHttpServer()).get("/api/mutation/100000").set('Authorization' as any, `Bearer ${jwt}`)
        expect(response.status).toBe(404)
    })

    it("/api/mutation/:id (GET) 401 condition", async () => {
        const response = await request(app.getHttpServer()).get("/api/mutation/1")
        expect(response.status).toBe(401)
    })
})