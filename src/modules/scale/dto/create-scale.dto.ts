import { IsArray, IsDateString } from 'class-validator';
import { CreateCooperatorsScaleDto } from './create-cooperators.scale.dto';

export class CreateScaleDto {
  @IsDateString()
  selected_date: string;

  @IsArray()
  cooperators: CreateCooperatorsScaleDto;
}
