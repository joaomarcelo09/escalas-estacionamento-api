import { IsNumber, IsString } from 'class-validator';

export class CreateCooperatorsScaleDto {
  @IsNumber()
  id_coop: number;

  @IsString()
  type: 'cooperator' | 'diacun';

  pinned_exceptions: any;

  exceptions: any;
}
