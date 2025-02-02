import { IsArray, IsEnum, IsNumber } from 'class-validator';
import { CreateCooperatorsScaleDto } from './create-cooperators.scale.dto';

export class ResponseSectorDto {
  @IsNumber()
  id_sector: number;

  @IsEnum({
    out: 'out',
    in: 'in',
  })
  type: 'out' | 'in';

  @IsArray()
  cooperators: CreateCooperatorsScaleDto[];
}
