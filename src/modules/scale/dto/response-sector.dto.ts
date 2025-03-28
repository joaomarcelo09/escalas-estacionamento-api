import { IsArray, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { CreateCooperatorsScaleDto } from './create-cooperators.scale.dto';

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
  cooperators: CreateCooperatorsScaleDto['id_coop'][];
}
