import { IsArray, IsDate, IsString } from 'class-validator';

export type ChoosedSector = {
  id_sector: number;
  id_coops: number[];
};

export class AlreadySelectedCooperatorsDto {
  @IsDate()
  date: Date;

  @IsString() // na vdd IsEnum
  period: string; // dps colocar o enum

  @IsArray()
  sectors: ChoosedSector[];
}
