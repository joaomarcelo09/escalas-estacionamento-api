import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';
import { ResponseSectorDto } from './response-sector.dto';

export class ResponseScaleDto {
  @IsNumber()
  id_group_scale: number;

  @IsString()
  period: string; // vai virar enum

  @IsDate()
  date: Date;

  @IsArray()
  sectors: ResponseSectorDto[];
}
