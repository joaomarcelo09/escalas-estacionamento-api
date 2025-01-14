import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma-service';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserRepository } from 'src/user/user.repository';
import { PrismaUserRepository } from 'src/database/repositories/prisma-user-repository';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: '123456',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    UserService,
    PrismaService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
