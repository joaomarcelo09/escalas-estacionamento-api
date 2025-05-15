import { Injectable } from '@nestjs/common';
import { CooperatorRepository } from 'src/modules/cooperator/cooperator.repository';
import { PrismaService } from '../prisma-service';
import { CreateCooperatorDto } from 'src/modules/cooperator/dto/create-cooperator-dto';
import { v4 as uuid } from 'uuid';
import { UpdateCooperatorDto } from 'src/modules/cooperator/dto/update-cooperator-dto';

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

  async createPinnedException(body) {
    return await this.prisma.pinnedException.create({
      data: {
        reason: body.reason,
        id_sector: body.sector,
        id_cooperator: body.id_cooperator,
      },
    });
  }

  async update(id: string, coop: UpdateCooperatorDto) {
    return await this.prisma.cooperators.update({
      where: {
        id,
      },
      data: {
        ...coop,
      },
    });
  }

  async updatePinnedException(id: string, data) {
    return await this.prisma.pinnedException.update({
      where: {
        id,
      },
      data,
    });
  }

  async deletePinnedException(id: string) {
    return await this.prisma.pinnedException.delete({
      where: {
        id,
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

  async findOne({ where, include }) {
    return await this.prisma.cooperators.findFirst({ where, include });
  }

  async findAll({ where, include }) {
    return await this.prisma.cooperators.findMany({ where, include });
  }
}
