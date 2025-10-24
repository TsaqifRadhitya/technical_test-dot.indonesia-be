import { Body, Controller, Delete, Post, Request, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
    async register(@Body() registerDTO: RegisterDTO, @Res() res: Response) {
        const response = await this.authService.register(registerDTO)
        return res.status(201).json({
            status: 201,
            message: "created",
            data: {
                ...response,
                password: undefined
            }
        })
    }

    @UseGuards(JwtAuthGuard)
    @Delete("disable_account")
    async disableAccount(@Request() req) {
        const { userId } = req.user
    }

    @UseGuards(LocalAuthGuard)
    @Post("activate_account")
    async enableAccount(@Body() body: LoginDTO, @Request() req) {

    }
}
