import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { MutationService } from './mutation.service';
import { CreateMutationDto } from './dto/create-mutation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Response } from 'express';
import { GetMutationQueryDTO } from './dto/get-mutation.dto';

@UseGuards(JwtAuthGuard)
@Controller('mutation')
export class MutationController {
  constructor(private readonly mutationService: MutationService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createMutationDto: CreateMutationDto,
    @Res() res: Response,
  ) {
    const { userId } = req.user;
    const createdData = await this.mutationService.create(
      userId,
      createMutationDto,
    );
    return res.status(201).json({
      statusCode: 201,
      message: 'created',
      data: { ...createdData, user: undefined, user_id: createdData.user.id },
    });
  }

  @Get()
  async index(
    @Req() req,
    @Res() res: Response,
    @Query() query: GetMutationQueryDTO,
  ) {
    const { userId } = req.user;
    const { data, metadata } = await this.mutationService.index(
      userId,
      query.page,
      query.limit,
    );
    return res.status(200).json({
      statusCode: 200,
      message: 'ok',
      data,
      metadata,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req, @Res() res: Response) {
    const { userId } = req.user;
    const mutationData = await this.mutationService.show(id, userId);
    return res.status(200).json({
      statusCode: 200,
      message: 'ok',
      data: mutationData,
    });
  }
}
