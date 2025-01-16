import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma-service';
import { PrismaUserRepository } from 'src/database/repositories/prisma-user-repository';
import { UserRepository } from './user.repository';

@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    UserService,
    PrismaService,
  ],
})
export class UserModule {}
