import { CreateCooperatorsScaleDto } from '../dto/create-cooperators.scale.dto';
import { ScaleDto } from '../dto/scale.dto';
import { SectorDto } from '../dto/sector.dto';

export const selectCooperator = ({
  scale,
  cooperators = [],
  sector,
}: {
  cooperators: CreateCooperatorsScaleDto[];
  scale: ScaleDto;
  sector: SectorDto;
}): CreateCooperatorsScaleDto[] => {
  const selectedCooperators: CreateCooperatorsScaleDto[] = [];

  // Manter a lógica existente para cooperadores pré-escolhidos
  const alreadyChoosedCooperatorsSameSector = cooperators.filter((coop) =>
    coop.assignments.some(
      (assign) =>
        assign.sector == sector.id &&
        new Date(assign.date).getTime() === scale.date.getTime() &&
        assign.period === scale.period,
    ),
  );

  if (alreadyChoosedCooperatorsSameSector.length) {
    selectedCooperators.push(...alreadyChoosedCooperatorsSameSector);
  }

  if (selectedCooperators.length === sector.quantity)
    return selectedCooperators;

  // Fallback: usar seleção aleatória se ainda não tiver cooperadores suficientes
  return [...selectedCooperators];
};
