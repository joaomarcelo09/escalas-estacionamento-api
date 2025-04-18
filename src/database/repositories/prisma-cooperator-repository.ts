import { Injectable } from '@nestjs/common';
import { CooperatorRepository } from 'src/modules/cooperator/cooperator.repository';
import { PrismaService } from '../prisma-service';
import { CreateCooperatorDto } from 'src/modules/cooperator/dto/create-cooperator-dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PrismaCooperatorRepository implements CooperatorRepository {
  constructor(private prisma: PrismaService) {}

  async create(coop: CreateCooperatorDto) {
    return await this.prisma.cooperators.create({
      data: {
        id: uuid(),
        ...coop,
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.cooperators.delete({
      where: {
        id,
      },
    });
  }

  async findAll({ where }) {
    return await this.prisma.cooperators.findMany({ where });
  }
}
