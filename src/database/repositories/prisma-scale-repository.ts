import { Injectable } from '@nestjs/common';
import { ScaleRepository } from 'src/modules/scale/scale.repository';
import { PrismaService } from '../prisma-service';

@Injectable()
export class PrismaScaleRepository implements ScaleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data, tx) {
    const prisma = tx ?? this.prisma;
    return await prisma.scale.create({
      data: {
        id: data.id,
        period: data.period,
        id_group_scale: data.id_group_scale,
      },
    });
  }

  async createGroupScale(data: any) {
    return await this.prisma.groupScale.create({
      data: {
        id: data.id,
        name: data.name,
      },
    });
  }

  async createScaleSector(data: any, tx) {
    const prisma = tx ?? this.prisma;
    return await prisma.scaleSector.create({ data });
  }

  async createCoopSectorScale(data: any, tx) {
    const prisma = tx ?? this.prisma;
    return await prisma.sectorCooperator.create({ data });
  }
}
