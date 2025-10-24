import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MutationService } from './mutation.service';
import { CreateMutationDto } from './dto/create-mutation.dto';
import { UpdateMutationDto } from './dto/update-mutation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('mutation')
export class MutationController {
  constructor(private readonly mutationService: MutationService) {}

  @Post()
  create(@Body() createMutationDto: CreateMutationDto) {
    return this.mutationService.create(createMutationDto);
  }

  @Get()
  findAll() {
    return this.mutationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mutationService.findOne(+id);
  }
}
