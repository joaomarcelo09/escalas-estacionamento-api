import { Module } from '@nestjs/common';
import { ScaleService } from './scale.service';
import { ScaleController } from './scale.controller';
import { GroupScaleService } from './group-scale.service';
import { SectorRepository } from '../sector/sector.repository';
import { PrismaSectorRepository } from 'src/database/repositories/prisma-sector-repository';
import { PrismaService } from 'src/database/prisma-service';
import { SectorService } from '../sector/sector.service';

@Module({
  controllers: [ScaleController],
  providers: [
    {
      provide: SectorRepository,
      useClass: PrismaSectorRepository,
    },
    PrismaService,
    ScaleService,
    GroupScaleService,
    SectorService,
  ],
})
export class ScaleModule {}
