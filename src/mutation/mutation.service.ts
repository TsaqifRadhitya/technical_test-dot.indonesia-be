import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMutationDto } from './dto/create-mutation.dto';
import { UpdateMutationDto } from './dto/update-mutation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mutation } from './entities/mutation.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class MutationService {

  constructor(@InjectRepository(Mutation) private mutationRepository: Repository<Mutation>) {

  }

  async show(id: number, userId: number) {
    const data = await this.findOne({
      id: id,
      user: {
        id: userId
      }
    });

    if (!data) {
      throw new NotFoundException()
    }

    return data
  }

  async create(userId: number, data: CreateMutationDto) {
    return this.mutationRepository.insert({
      ...CreateMutationDto,
      user: {
        id: userId
      }
    });
  }

  async findAll(option?: FindManyOptions<Mutation>) {
    return this.mutationRepository.find({
      ...option
    })
  }

  findOne(option: FindOptionsWhere<Mutation>) {
    return this.mutationRepository.findOne({
      where: option
    })
  }
}
