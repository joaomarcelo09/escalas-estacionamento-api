import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { CreateCooperatorsScaleDto } from './create-cooperators.scale.dto';

export class CreateScaleDto {
  @IsDateString()
  selected_date: string;

  @IsString()
  @IsOptional()
  departament: string;

  @IsArray()
  cooperators: CreateCooperatorsScaleDto[];
}
