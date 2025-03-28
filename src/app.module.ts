import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaService } from 'src/database/prisma-service';
import { CooperatorModule } from './modules/cooperator/cooperator.module';
import { ScaleModule } from './modules/scale/scale.module';
import { SectorService } from './modules/sector/sector.service';
import { PrismaSectorRepository } from './database/repositories/prisma-sector-repository';
import { SectorRepository } from './modules/sector/sector.repository';

@Module({
  imports: [AuthModule, UserModule, CooperatorModule, ScaleModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    SectorService,
    {
      provide: SectorRepository,
      useClass: PrismaSectorRepository,
    },
  ],
})
export class AppModule {}
