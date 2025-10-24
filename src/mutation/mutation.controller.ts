import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req, Query } from '@nestjs/common';
import { MutationService } from './mutation.service';
import { CreateMutationDto } from './dto/create-mutation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('mutation')
export class MutationController {
  constructor(private readonly mutationService: MutationService) { }

  @Post()
  async create(@Req() req, @Body() createMutationDto: CreateMutationDto, @Res() res: Response) {
    const { userId } = req.user
    const createdData = await this.mutationService.create(userId, createMutationDto)
    return res.status(201).json({
      status: 201,
      message: "created",
      data: createdData
    })
  }

  @Get()
  async findAll(@Req() req, @Res() res: Response, @Query('perpage') perpage: number, @Query('page') page: number) {
    const { userId } = req.user
    const mutationsUserData = await this.mutationService.findAll(userId)
    return res.status(200).json({
      status: 200,
      message: "ok",
      data: mutationsUserData
    })
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req, @Res() res: Response) {
    const { userId } = req.user
    const mutationData = await this.mutationService.show(id, userId)
    return res.status(200).json({
      status: 200,
      message: "ok",
      data: mutationData
    })
  }
}
