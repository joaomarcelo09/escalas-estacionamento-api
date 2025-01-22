import { IsNumber, IsString } from 'class-validator';

export class CreateCooperatorsScaleDto {
  @IsNumber()
  id_coop: number;

  @IsString()
  type: string;

  pinned_exceptions: any;

  exceptions: any;
}
