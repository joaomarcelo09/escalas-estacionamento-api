import { IsArray, IsDateString } from 'class-validator';
import { CreateCooperatorsScaleDto } from './create-cooperators.scale.dto';
import { AlreadySelectedCooperatorsDto } from './already-selected-cooperators.dto';

export class CreateScaleDto {
  @IsDateString()
  selected_date: string;

  @IsArray()
  alreadySelectedCooperators: AlreadySelectedCooperatorsDto[];

  @IsArray()
  cooperators: CreateCooperatorsScaleDto[];
}
