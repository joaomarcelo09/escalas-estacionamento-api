import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSectorDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  quantity: string;

  @IsEnum({
    STANDING: 'STANDING',
    SITTING: 'SITTING',
  })
  mode: 'STANDING' | 'SITTING';

  @IsEnum({
    IN: 'IN',
    OUT: 'OUT',
  })
  type: 'IN' | 'OUT';

  @IsBoolean()
  is_departament: boolean;
}
