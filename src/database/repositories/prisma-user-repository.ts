import { UserRepository } from 'src/user/user.repository';
import { PrismaService } from 'src/database/prisma-service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { HashPassword } from 'src/helpers/security/bcrypt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: CreateUserDto) {
    user.password = await HashPassword(user.password);

    return await this.prisma.user.create({
      data: {
        id: uuid(),
        ...user,
      },
    });
  }

  async findOne({ where }) {
    return await this.prisma.user.findFirst({ where });
  }
}
