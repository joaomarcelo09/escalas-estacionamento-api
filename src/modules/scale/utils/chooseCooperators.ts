import { getDay } from 'date-fns/getDay';
import { CreateCooperatorsScaleDto } from '../dto/create-cooperators.scale.dto';
import { ResponseScaleDto } from '../dto/response-scale.dto';
import { ResponseSectorDto } from '../dto/response-sector.dto';
import { ScaleDto } from '../dto/scale.dto';
import { SectorDto } from '../dto/sector.dto';

type QueueCooperator = {
  priority: number;
  cooperator: CreateCooperatorsScaleDto;
};

export const chooseCooperators = ({
  cooperators = [],
  scale,
  sector,
  memoryScale,
  // memorySector,
}: {
  cooperators: CreateCooperatorsScaleDto[];
  scale: ScaleDto;
  sector: SectorDto;
  memoryScale: ResponseScaleDto[];
  memorySector: ResponseSectorDto[];
}): CreateCooperatorsScaleDto[] => {
  const selectedCooperators: CreateCooperatorsScaleDto[] = [];
  const dayOfWeek = getDay(scale.date);
  const queue: QueueCooperator[] = [];
  let availableCooperators: CreateCooperatorsScaleDto[] = [...cooperators]; // se nao fizer o spread, eles vao apontar pra mesma referência

  // primeiramente, será verificado se já possui pessoas pré-escolhidas para a escala, caso tenha, ele já vai escalar

  const alreadyChoosedCooperatorsSameSector = cooperators.filter(
    (coop) => coop.choosedScale?.sectorId === sector.id_sector,
  );

  if (alreadyChoosedCooperatorsSameSector.length) {
    const choosedCooperatorsIdSameSector =
      alreadyChoosedCooperatorsSameSector.map((coop) => coop.id_coop);

    selectedCooperators.push(...alreadyChoosedCooperatorsSameSector);
    availableCooperators = availableCooperators.filter(
      (coop) => !choosedCooperatorsIdSameSector.includes(coop.id_coop),
    );
  }

  if (selectedCooperators.length === sector.quantity)
    return selectedCooperators; // se ja tem a quantidade esperada para o setor, retorna

  // aqui, começará a filtragem por prioridade

  const oldScalesSameDayAndPeriod = memoryScale.filter(
    (scaleFilter) =>
      scale.period === scaleFilter.period && getDay(scale.date) === dayOfWeek,
  );

  const lastScaleSameDayAndPeriod = oldScalesSameDayAndPeriod.at(-1);

  if (lastScaleSameDayAndPeriod) {
    lastScaleSameDayAndPeriod.sectors.forEach((sec) => {
      if (sec.type !== sector.type) {
        const cooperatorsWithPriority = availableCooperators.filter((coop) =>
          sec.cooperators.includes(coop.id_coop),
        );

        queue.push(
          ...cooperatorsWithPriority.map((coop) => ({
            priority: 10,
            cooperator: coop,
          })),
        );
        return;
      }
      if (sec.type === sector.type) {
        const cooperatorsWithPriority = availableCooperators.filter((coop) =>
          sec.cooperators.includes(coop.id_coop),
        );

        queue.push(
          ...cooperatorsWithPriority.map((coop) => ({
            priority: 0,
            cooperator: coop,
          })),
        );
      }
    });
    const orderedQueue = queue.sort((a, b) => (b.priority = a.priority));
    const cooperatorsNeeded = sector.quantity - chooseCooperators.length;
    const pickedCooperatorsByPriority = orderedQueue.slice(
      0,
      cooperatorsNeeded - 1,
    );

    selectedCooperators.push(
      ...pickedCooperatorsByPriority.map((coop) => coop.cooperator),
    );
  }

  if (selectedCooperators.length === sector.quantity)
    return selectedCooperators;

  return [...availableCooperators]
    .sort(() => Math.random() - 0.5)
    .slice(0, sector.quantity);

  // em ultimo caso ou se atingir uma determinada prioridade
  // se faltar cooperador, pode escalar diácuno
};
