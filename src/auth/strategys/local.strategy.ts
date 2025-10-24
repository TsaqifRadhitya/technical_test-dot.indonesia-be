
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginDTO } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<any> {
        const payload = {
            email: email || undefined,
            password: password || undefined,
        };

        const dto = plainToInstance(LoginDTO, payload || {})
        const errors = await validate(dto)
        if (errors.length > 0) {
            const messages = errors.flatMap(err =>
                Object.values(err.constraints ?? {}),
            );
            throw new BadRequestException(messages);
        }

        const user = await this.authService.validateUser(dto.email, dto.password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
