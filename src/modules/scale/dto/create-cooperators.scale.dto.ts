import { IsString } from 'class-validator';
import { SectorDto } from './sector.dto';

export class CreateCooperatorsScaleDto {
  @IsString({ message: 'id must be a string' })
  id_coop: string;

  @IsString()
  type: 'COOPERATOR' | 'DIACUN';

  pinned_exceptions: any;

  assignments: {
    date: Date;
    period: 'morning' | 'night';
    sector: SectorDto['id'];
  }[];

  exceptions: any;
  coop_name: any;
}
