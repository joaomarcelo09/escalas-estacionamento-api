import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from './decorator/guard-decorator';
import { LoginUserDto, RefreshTokenDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Body() data: LoginUserDto) {
    return this.authService.login(data);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('refresh-token')
  async refresh_token(@Body() data: RefreshTokenDto) {
    return this.authService.refreshToken(data.refresh_token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('validate-token')
  async validate_token() {
    return true;
  }
}
