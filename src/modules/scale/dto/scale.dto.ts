import { IsArray, IsDate, IsString } from 'class-validator';
import { SectorDto } from './sector.dto';

export class ScaleDto {
  @IsDate()
  date: Date;

  @IsString()
  period: string;

  @IsArray()
  sectors: SectorDto[];
}
