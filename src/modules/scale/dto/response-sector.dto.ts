import { IsArray, IsEnum, IsNumber, IsUUID } from 'class-validator';

export class ResponseSectorDto {
  @IsUUID()
  id_scale: string;

  @IsNumber()
  id_sector: number;

  @IsEnum({
    out: 'OUT',
    in: 'IN',
  })
  type: 'OUT' | 'IN';

  @IsArray()
  cooperators: any;
}
