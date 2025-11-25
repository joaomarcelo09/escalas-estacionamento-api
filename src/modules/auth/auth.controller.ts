import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from './decorator/guard-decorator';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('register')
  async register(
    @Body() data: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, ...response } =
      await this.authService.register(data);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh-token',
      maxAge: 45 * 24 * 60 * 60 * 1000,
    });
    return response;
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(
    @Body() data: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, ...response } = await this.authService.login(data);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh-token',
      maxAge: 45 * 24 * 60 * 60 * 1000,
    });
    return response;
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('refresh-token')
  async refresh_token(@Req() req) {
    const refreshToken = req.cookies['refresh_token'];
    const response = await this.authService.refreshToken(refreshToken);
    return response;
  }

  @HttpCode(HttpStatus.OK)
  @Post('validate-token')
  async validate_token() {
    return true;
  }
}
