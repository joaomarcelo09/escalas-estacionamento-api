import { IsNumber, IsString } from 'class-validator';
import { SectorDto } from './sector.dto';

export class CreateCooperatorsScaleDto {
  @IsNumber()
  id_coop: number;

  @IsString()
  type: 'cooperator' | 'diacun';

  pinned_exceptions: any;

  choosedScale: {
    date: Date;
    period: 'morning' | 'night';
    sectorId: SectorDto['id_sector'];
  };

  exceptions: any;
}
