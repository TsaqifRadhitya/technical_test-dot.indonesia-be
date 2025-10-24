import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import { jwtConstants } from './constants/constants';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(Session) private sessionRepository: Repository<Session>, private usersService: UserService, private jwtService: JwtService) {

    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne({ where: { email } })
        if (user && await bcrypt.compare(pass, user.password)) {
            return { email: user.email, userId: user.id };
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.userId };
        const jwt = this.jwtService.sign(payload, { secret: jwtConstants.secret })
        await this.sessionRepository.insert({
            Token: jwt,
            user: {
                id: user.userId
            }
        })
        return {
            access_token: jwt,
        };
    }

    async logout(token: string) {
        const session = await this.sessionRepository.findOne({
            where: {
                Token: token
            }
        })
        if (!session) {
            throw new UnauthorizedException()
        }
        await this.sessionRepository.remove(session)
    }

    async register(data: RegisterDTO) {
        const hashedPassword = await bcrypt.hash(data.password, 10)
        try {
            return await this.usersService.create({
                email: data.email,
                name: data.name,
                password: hashedPassword
            })
        } catch {
            throw new BadRequestException({
                status: 400,
                message: 'validation exception',
                error: {
                    email: ["email already exists"]
                },
            })
        }
    }

    async isValid_jwt(token: string) {
        return !!(await this.sessionRepository.findOne({
            where: {
                Token: token
            }
        }))
    }

    async disableAccount(userId: number) {
        const sessions = await this.sessionRepository.find({
            where: {
                user: {
                    id: userId
                }
            }
        })
        await this.sessionRepository.delete(sessions)
        await this.usersService.softDelete(userId)
    }

    async enableAccount(data: LoginDTO) {
        const user = await this.usersService.findOne({
            where: {
                email: data.email
            },
            withDeleted: true
        })

        if (!(user && await bcrypt.compare(data.password, user.password))) {
            throw new UnauthorizedException()
        }

        if (!user.deletedAt) {
            throw new ConflictException()
        }

        await this.usersService.restoreSoftDelete(user.id)
    }
}
