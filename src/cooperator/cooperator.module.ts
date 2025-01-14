import { Module } from '@nestjs/common';
import { CooperatorService } from './cooperator.service';
import { CooperatorController } from './cooperator.controller';
import { CooperatorRepository } from './cooperator.repository';
import { PrismaCooperatorRepository } from 'src/database/repositories/prisma-cooperator-repository';
import { PrismaService } from 'src/database/prisma-service';

@Module({
  providers: [
    {
      provide: CooperatorRepository,
      useClass: PrismaCooperatorRepository,
    },
    CooperatorService,
    PrismaService,
  ],

  controllers: [CooperatorController],
})
export class CooperatorModule {}
