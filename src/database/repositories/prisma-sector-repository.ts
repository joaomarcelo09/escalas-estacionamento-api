import { Injectable } from '@nestjs/common';
import { SectorRepository } from 'src/modules/sector/sector.repository';
import { PrismaService } from '../prisma-service';

@Injectable()
export class PrismaSectorRepository implements SectorRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.sector.findMany();
  }
}
