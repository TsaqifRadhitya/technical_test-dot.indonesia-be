import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {

  }

  findOne(option: FindOneOptions<User>) {
    return this.userRepository.findOne(option)
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!updateUserDto.email && !updateUserDto.name) {
      throw new BadRequestException({
        statusCode: 400,
        message: "Bad Request",
        error: {
          name: ["name is required if other field is empty"],
          email: ["email is required if other field is empty"],
        }
      })
    }

    await this.userRepository.save({
      id: id,
      ...updateUserDto
    })

    return this.userRepository.findOne({
      where: { id: id }, select: {
        email: true,
        created_at: true,
        id: true,
        name: true,
        updated_at: true
      }
    })
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
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })

    if (!(await bcrypt.compare(newData.current_password, user!.password))) {
      throw new UnauthorizedException()
    }

    await this.userRepository.save(
      {
        id: userId,
        password: newPassword
      }
    );
  }

  async restoreSoftDelete(id: number) {
    return this.userRepository.restore(id)
  }

  async softDelete(id: number) {
    return await this.userRepository.softDelete(id)
  }

  async create(data: Partial<User>) {
    return this.userRepository.save(data)
  }
}
