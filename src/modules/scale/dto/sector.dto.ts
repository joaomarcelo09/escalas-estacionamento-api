import { IsEnum, IsNumber, IsString } from 'class-validator';

export class SectorDto {
  @IsNumber()
  id: number;

  @IsNumber()
  quantity: number;

  @IsString()
  name: string;

  @IsEnum({
    out: 'out',
    in: 'in',
  })
  type: 'out' | 'in';
}
