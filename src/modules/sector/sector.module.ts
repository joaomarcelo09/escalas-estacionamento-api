import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma-service';
import { SectorRepository } from './sector.repository';
import { PrismaSectorRepository } from 'src/database/repositories/prisma-sector-repository';
import { SectorService } from './sector.service';
import { SectorController } from './sector.controller';

@Module({
  providers: [
    {
      provide: SectorRepository,
      useClass: PrismaSectorRepository,
    },
    SectorService,
    PrismaService,
  ],

  controllers: [SectorController],
})
export class SectorModule {}
