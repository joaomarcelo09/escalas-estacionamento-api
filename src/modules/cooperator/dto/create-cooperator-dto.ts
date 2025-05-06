import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateCooperatorDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  telephone: string;

  @IsEnum({
    COOPERATOR: 'COOPERATOR',
    DEACUN: 'DEACUN',
  })
  type: 'COOPERATOR' | 'DEACUN';
}
