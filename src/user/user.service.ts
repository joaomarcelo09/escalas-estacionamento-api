import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/database/prisma-service"
import { Prisma } from '@prisma/client'
import { CreateUserDto } from 'src/auth/dto/create-user.dto'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async create(data: CreateUserDto) {
 
    return await this.repository.create(data)
  }

  async findOne({ where }) {
    return await this.repository.findOne({ where })
  }
}
