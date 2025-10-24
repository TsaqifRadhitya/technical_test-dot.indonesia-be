import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {

  }

  index(id: number) {
    return this.userRepository.findOne({
      where: {
        id: id
      }
    })
  }

  findOne(option: FindOptionsWhere<User>) {
    return this.userRepository.findOne({
      where: option
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({
      id: id
    }, updateUserDto)
  }

  remove(id: number) {
    this.userRepository.softDelete({
      id: id
    })
  }
}
