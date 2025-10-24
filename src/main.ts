import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import dotenv from "dotenv"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory(errors) {
      const formattedErrors = {}

      errors.forEach((error) => {
        if (error.constraints) {
          formattedErrors[error.property] = Object.values(error.constraints)
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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
