import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async create(data: CreateUserDto) {
    return await this.repository.create(data);
  }

  async findOne({ where }) {
    return await this.repository.findOne({ where });
  }

  async update(data) {
    return await this.repository.update(data);
  }
}
