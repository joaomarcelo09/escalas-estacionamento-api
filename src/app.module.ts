import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from 'src/database/prisma-service';
import { CooperatorModule } from './cooperator/cooperator.module';

@Module({
  imports: [AuthModule, UserModule, CooperatorModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
