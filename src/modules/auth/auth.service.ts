import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { comparePassword } from 'src/helpers/security/bcrypt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  async register(user: CreateUserDto) {
    user.id = uuid();

    const refresh_payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const refresh_token = await this.jwt.signAsync(refresh_payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const new_user = await this.userService.create(user);

    const payload = {
      sub: new_user.id,
      email: new_user.email,
      name: new_user.name,
      app_type: new_user.id_app_type,
    };

    return {
      payload,
      access_token: await this.jwt.signAsync(payload),
      refresh_token,
    };
  }

  async login(user: LoginUserDto) {
    const where = { email: user.email };

    const findUser = await this.userService.findOne({ where });

    if (!findUser)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    const isEqualPassword = await comparePassword(
      user.password,
      findUser.password,
    );

    if (!isEqualPassword) throw new UnauthorizedException('Senha inválida');

    const payload = {
      sub: findUser.id,
      email: findUser.email,
      name: findUser.name,
      app_type: findUser.id_app_type,
    };

    const refresh_token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      payload,
      access_token: await this.jwt.signAsync(payload),
      refresh_token,
    };
  }

  async refreshToken(refreshToken: string | undefined) {
    try {
      if (!refreshToken) throw new UnauthorizedException();

      const decoded = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      if (!decoded) throw new UnauthorizedException();

      const user = await this.userService.findOne({
        where: { id: decoded.sub },
      });

      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      };

      const access_token = await this.jwt.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      });

      return {
        access_token,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
