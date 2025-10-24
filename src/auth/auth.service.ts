import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {

    invalidate_jwt: string[] = []

    constructor(@InjectRepository(User) private userRepository: Repository<User>, private usersService: UserService, private jwtService: JwtService) {

    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne({ email });
        if (user && await bcrypt.compare(pass, user.password)) {
            return { email: user.email, userId: user.id };
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    logout(token: string) {
        const invalidated_jwt_check = !!this.invalidate_jwt.find((jwt) => jwt === token)
        if (invalidated_jwt_check) {
            throw new UnauthorizedException()
        }
        this.invalidate_jwt = [...this.invalidate_jwt, token]
    }

    async register(data: RegisterDTO) {
        const hashedPassword = await bcrypt.hash(data.password, 10)
        try {
            return await this.userRepository.insert({
                email: data.email,
                name: data.name,
                password: hashedPassword
            })
        } catch {
            throw new BadRequestException({
                status: 400,
                message: 'validation exception',
                error: {
                    email: "email already exists"
                },
            })
        }
    }

    isInvalidate_jwt(token: string) {
        return !!this.invalidate_jwt.find((jwt) => jwt === token)
    }

    async disableAccount(userId: number) {
        await this.userRepository.softDelete({
            id: userId
        })
    }

    async enableAccount(data: LoginDTO) {
        const user = await this.userRepository.findOne({
            where: {
                email: data.email
            },
            withDeleted: true
        });
        if (!(user && await bcrypt.compare(data.password, user.password))) {
            throw new UnauthorizedException()
        }

        await this.userRepository.softRemove(user)
    }
}
