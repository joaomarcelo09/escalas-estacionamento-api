import { Injectable } from '@nestjs/common';
import { ScaleRepository } from 'src/modules/scale/scale.repository';
import { PrismaService } from '../prisma-service';

@Injectable()
export class PrismaScaleRepository implements ScaleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data) {
    return await this.prisma.scale.create(data);
  }

  async createGroupScale(data: any) {
    return await this.prisma.groupScale.create(data);
  }
}
