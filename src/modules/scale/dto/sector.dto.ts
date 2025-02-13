import { IsEnum, IsNumber } from 'class-validator';

export class SectorDto {
  @IsNumber()
  id_sector: number;

  @IsNumber()
  quantity: number;

  @IsEnum({
    out: 'out',
    in: 'in',
  })
  type: 'out' | 'in';
}
