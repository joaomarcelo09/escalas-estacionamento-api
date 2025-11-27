import { Injectable } from '@nestjs/common';
import { SectorRepository } from 'src/modules/sector/sector.repository';
import { PrismaService } from '../prisma-service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PrismaSectorRepository implements SectorRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.sector.findMany();
  }

  async findOne({ where, include }) {
    return await this.prisma.sector.findFirst({ where, include });
  }

  async create(data) {
    return await this.prisma.sector.create({
      data: {
        id: uuid(),
        id_seeder: null,
        quantity: 1,
        ...data,
      },
    });
  }

  async update(id: string, data) {
    return await this.prisma.sector.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.sector.delete({
      where: {
        id,
      },
    });
  }

  async deletePinnedException(id: string) {
    return await this.prisma.pinnedException.delete({
      where: {
        id,
      },
    });
  }

}
