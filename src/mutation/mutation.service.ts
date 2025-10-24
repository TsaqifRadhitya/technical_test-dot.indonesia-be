import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMutationDto } from './dto/create-mutation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mutation } from './entities/mutation.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class MutationService {

  constructor(@InjectRepository(Mutation) private mutationRepository: Repository<Mutation>) {

  }

  async index(user_id: number, page: number, limit: number): Promise<{ metadata: object, data: Mutation[] }> {
    const [data, count] = await this.mutationRepository.findAndCount({
      skip: (page - 1) * limit,
      take: page * limit,
      where: {
        user: {
          id: user_id
        }
      },
    })

    const lastPage = count % limit === 0 ? Math.floor(count / limit) : Math.floor(count / limit) + 1

    return {
      data: data,
      metadata: {
        total: count,
        page: page,
        next_page: page < lastPage ? page + 1 : null,
        prev_page: page > lastPage ? lastPage : page === 1 ? null : page - 1,
        first_page: 1,
        last_page: lastPage,
        next_page_url: page < lastPage ? `/api/mutation?page=${page + 1}&perpage=${limit}` : null,
        prev_page_url: page > lastPage ? `/api/mutation?page=${lastPage}&perpage=${limit}` : page === 1 ? null : `/api/mutation?page=${page - 1}&perpage=${limit}`,
        last_page_url: `/api/mutation?page=${lastPage}&perpage=${limit}`,
        first_page_url: `/api/mutation?page=${1}&perpage=${limit}`
      }
    }
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
    return await this.mutationRepository.save({
      amount: data.amount,
      transaction_type: data.transaction_type as any,
      user: {
        id: userId
      }
    },);
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
