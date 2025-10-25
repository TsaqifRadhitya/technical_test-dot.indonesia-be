import { Body, Controller, Delete, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {

    }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Body() body: LoginDTO, @Req() req, @Res() res: Response) {
        const data = await this.authService.login(req.user)
        return res.status(200).json({
            statusCode: 200,
            message: "ok",
            data
        })
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        const bearerToken = req.headers.authorization?.split(" ")[1]
        this.authService.logout(bearerToken as string)
        return res.status(200).json({
            statusCode: 200,
            message: "ok"
        })
    }

    @Post("register")
    async register(@Body() registerDTO: RegisterDTO, @Res() res: Response) {
        const response = await this.authService.register(registerDTO)
        return res.status(201).json({
            statusCode: 201,
            message: "created",
            data: {
                ...response,
                password: undefined
            }
        })
    }

    @UseGuards(JwtAuthGuard)
    @Delete("disable_account")
    async disableAccount(@Req() req, @Res() res: Response) {
        const { userId } = req.user
        await this.authService.disableAccount(userId)
        return res.status(200).json({
            statusCode: 200,
            message: "ok"
        })
    }

    @Post("activate_account")
    async enableAccount(@Body() body: LoginDTO, @Req() req, @Res() res: Response) {
        await this.authService.enableAccount(body)
        return res.status(200).json({
            statusCode: 200,
            message: "ok"
        })
    }
}
