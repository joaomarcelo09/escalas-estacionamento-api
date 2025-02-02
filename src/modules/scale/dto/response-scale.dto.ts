import { ResponseSectorDto } from './response-sector.dto';

export class ResponseScaleDto {
  id_group_scale: number;
  period: string; // vai virar enum
  date: Date;
  sectors: ResponseSectorDto[];
}
