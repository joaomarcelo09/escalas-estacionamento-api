import { UserRepository } from 'src/modules/user/user.repository';
import { PrismaService } from 'src/database/prisma-service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { HashPassword } from 'src/helpers/security/bcrypt';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: CreateUserDto) {
    user.password = await HashPassword(user.password);

    return await this.prisma.user.create({
      data: {
        ...user,
      },
    });
  }

  async update(user) {
    return await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...user,
      },
    });
  }

  async findOne({ where }) {
    return await this.prisma.user.findFirst({ where });
  }
}
