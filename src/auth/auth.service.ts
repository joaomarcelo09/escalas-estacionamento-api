import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { comparePassword } from 'src/helpers/security/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  async register(user: CreateUserDto) {
    const newUser = await this.userService.create(user);

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };

    return {
      payload,
      access_token: await this.jwt.signAsync(payload),
    };
  }

  async login(user: LoginUserDto) {
    const where = { email: user.email };

    const findUser = await this.userService.findOne({ where });

    if (!findUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (!comparePassword(user.password, findUser.password))
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);

    const payload = {
      sub: findUser.id,
      email: findUser.email,
      name: findUser.name,
    };

    return { payload, access_token: await this.jwt.signAsync(payload) };
  }
}
