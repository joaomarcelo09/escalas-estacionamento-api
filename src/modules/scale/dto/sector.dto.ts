import { IsEnum, IsNumber, IsString } from 'class-validator';

export class SectorDto {
  @IsNumber()
  id_sector: number;

  @IsNumber()
  minimal: number;

  @IsNumber()
  limit: number;

  @IsEnum({
    out: 'out',
    in: 'in',
  })
  type: 'out' | 'in';
}
