import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/database/prisma-service"
import { Prisma } from '@prisma/client'
import { HashPassword } from 'src/helpers/security/bcrypt'
import { v4 as uuid } from 'uuid'
import { CreateUserDto } from 'src/auth/dto/create-user.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    data.password = await HashPassword(data.password)

    return await this.prisma.user.create({data: {
      id: uuid(),
      ...data
    }})
  }

  async findOne(where: Prisma.UserWhereInput) {
    return await this.prisma.user.findFirst({where})
  }
}
