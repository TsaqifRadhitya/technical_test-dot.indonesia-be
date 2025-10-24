import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {

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

  async getSaldo(id: number) {
    const userData = await this.userRepository.findOne({
      where: {
        id: id
      },
      relationLoadStrategy: "query",
      loadEagerRelations: true,
      relations: {
        mutations: true
      }
    })

    const { mutations } = userData!

    const saldo = mutations.reduce((prev, current) => current.transaction_type == "deposit" ? prev + current.amount : prev - current.amount, 0)
    return saldo
  }

  async updatePassword(userId: number, newData: UpdatePasswordDTO) {
    const newPassword = await bcrypt.hash(newData.new_password, 10)
    await this.userRepository.update({
      id: userId
    }, {
      password: newPassword
    })
  }
}
