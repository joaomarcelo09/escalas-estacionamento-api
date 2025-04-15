import { Module } from '@nestjs/common';
import { ScaleService } from './scale.service';
import { ScaleController } from './scale.controller';
import { GroupScaleService } from './group-scale.service';
import { SectorRepository } from '../sector/sector.repository';
import { PrismaSectorRepository } from 'src/database/repositories/prisma-sector-repository';
import { PrismaService } from 'src/database/prisma-service';
import { SectorService } from '../sector/sector.service';
import { ScaleRepository } from './scale.repository';
import { PrismaScaleRepository } from 'src/database/repositories/prisma-scale-repository';
import { CooperatorService } from '../cooperator/cooperator.service';
import { PrismaCooperatorRepository } from 'src/database/repositories/prisma-cooperator-repository';
import { CooperatorRepository } from '../cooperator/cooperator.repository';

@Module({
  controllers: [ScaleController],
  providers: [
    {
      provide: SectorRepository,
      useClass: PrismaSectorRepository,
    },
    {
      provide: ScaleRepository,
      useClass: PrismaScaleRepository,
    },
    {
      provide: CooperatorRepository,
      useClass: PrismaCooperatorRepository,
    },
    PrismaService,
    ScaleService,
    GroupScaleService,
    SectorService,
    CooperatorService,
  ],
})
export class ScaleModule {}
