import { IsString } from "class-validator";

export class CreateCooperatorDto {
  
  @IsString()
  name: string

  @IsString()
  telephone: string

}
