import { IsEnum, IsString } from 'class-validator';

export class CreateCooperatorDto {
  @IsString()
  name: string;

  @IsString()
  telephone: string;

  @IsEnum({
    COOPERATOR: 'COOPERATOR',
    DEACUN: 'DEACUN',
  })
  type: 'COOPERATOR' | 'DEACUN';
}
