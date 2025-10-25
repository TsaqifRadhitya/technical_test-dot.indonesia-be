import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { LoginDTO } from '../dto/login.dto';
import { validate } from 'class-validator';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const dto = plainToInstance(LoginDTO, request.body || {});
    const errors = await validate(dto);

    if (errors.length > 0) {
      const formattedErrors = {};
      errors.forEach((error) => {
        if (error.constraints) {
          formattedErrors[error.property] = Object.values(error.constraints);
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
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        error: formattedErrors,
      });
    }

    return (await super.canActivate(context)) as boolean;
  }
}
