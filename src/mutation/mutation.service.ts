import { Injectable } from '@nestjs/common';
import { CreateMutationDto } from './dto/create-mutation.dto';
import { UpdateMutationDto } from './dto/update-mutation.dto';

@Injectable()
export class MutationService {
  create(createMutationDto: CreateMutationDto) {
    return 'This action adds a new mutation';
  }

  findAll() {
    return `This action returns all mutation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mutation`;
  }

  update(id: number, updateMutationDto: UpdateMutationDto) {
    return `This action updates a #${id} mutation`;
  }

  remove(id: number) {
    return `This action removes a #${id} mutation`;
  }
}
