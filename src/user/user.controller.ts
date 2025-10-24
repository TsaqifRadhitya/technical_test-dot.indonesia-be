import { Controller, Get, Post, Body, Patch, UseGuards, Request, Res, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Response } from 'express';
import { UpdatePasswordDTO } from './dto/update-password.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async index(@Request() req, @Res() res: Response) {
    const { userId } = req.user
    const response = await this.userService.findOne({ where: { id: userId } })
    return res.status(200).json({
      status: 200,
      message: "ok",
      data: response
    })
  }


  @Patch()
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    const { userId } = req.user
    const response = await this.userService.update(userId, updateUserDto);
    return res.status(200).json({
      status: 200,
      message: "ok",
      data: response
    })
  }

  @Put("/update_password")
  async updatePassword(@Request() req, @Body() updateUserDto: UpdatePasswordDTO, @Res() res: Response) {
    const { userId } = req.user
    await this.userService.updatePassword(userId, updateUserDto)
    return res.status(200).json({
      status: 200,
      message: "ok",
    })
  }

  @Get("/saldo")
  async saldo(@Request() req, @Res() res: Response) {
    const { userId } = req.user
    const saldo = await this.userService.getSaldo(userId)
    return res.status(200).json({
      status: 200,
      message: "ok",
      data: {
        saldo
      }
    })
  }
}
