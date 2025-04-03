import { IsString } from 'class-validator';
import { SectorDto } from './sector.dto';

export class CreateCooperatorsScaleDto {
  @IsString({ message: 'id must be a string' })
  id_coop: string;

  @IsString()
  type: 'cooperator' | 'diacun';

  pinned_exceptions: any;

  assignment: {
    date: Date;
    period: 'morning' | 'night';
    sectorId: SectorDto['id'];
  };

  exceptions: any;
}
