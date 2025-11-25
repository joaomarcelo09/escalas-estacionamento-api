import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refresh_token: string;
}
