import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

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
}
