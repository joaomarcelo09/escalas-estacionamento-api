import { CreateCooperatorsScaleDto } from './create-cooperators.scale.dto';

export type ResponseSectorDto = {
  id_sector: number;
  cooperators: CreateCooperatorsScaleDto[];
};
