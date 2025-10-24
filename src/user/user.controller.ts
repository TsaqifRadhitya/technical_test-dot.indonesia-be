import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  index(@Request() req) {
    const { userId } = req.user
    return this.userService.index(userId)
  }


  @Patch()
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const { userId } = req.user
    return this.userService.update(userId, updateUserDto);
  }
}
