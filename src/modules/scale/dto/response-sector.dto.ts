import { IsArray, IsEnum, IsNumber, IsUUID } from 'class-validator';

export class ResponseSectorDto {
  @IsUUID()
  id_scale: string;

  @IsNumber()
  id_sector: number;

  @IsEnum({
    out: 'out',
    in: 'in',
  })
  type: 'out' | 'in';

  @IsArray()
  cooperators: any;
}
