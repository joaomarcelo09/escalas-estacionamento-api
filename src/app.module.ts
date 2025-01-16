import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaService } from 'src/database/prisma-service';
import { CooperatorModule } from './modules/cooperator/cooperator.module';

@Module({
  imports: [AuthModule, UserModule, CooperatorModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
