import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {

    }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Body() body: LoginDTO, @Request() req) {
        return this.authService.login(req.user)
    }

    @UseGuards(LocalAuthGuard)
    @Post('logout')
    async logout(@Request() req) {
        return req.logout();
    }

    @Post("register")
    async register(@Body() reigsterReq: RegisterDTO) {

    }
}
