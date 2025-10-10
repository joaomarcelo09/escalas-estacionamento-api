import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

export class SectorDto {
  @IsNumber()
  id: number;

  @IsNumber()
  quantity: number;

  @IsString()
  name: string;

  @IsEnum({
    out: 'OUT',
    in: 'IN',
  })
  type: 'IN' | 'OUT';

  @IsBoolean()
  is_departament: boolean;
}
