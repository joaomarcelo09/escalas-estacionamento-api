import { IsNumber } from 'class-validator';

export class SectorDto {
  @IsNumber()
  id_sector: number;

  @IsNumber()
  minimal: number;

  @IsNumber()
  limit: number;
}
