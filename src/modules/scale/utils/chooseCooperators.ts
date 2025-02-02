import { getDay } from 'date-fns/getDay';
import { AlreadySelectedCooperatorsDto } from '../dto/already-selected-cooperators.dto';
import { CreateCooperatorsScaleDto } from '../dto/create-cooperators.scale.dto';
import { ResponseScaleDto } from '../dto/response-scale.dto';
import { ResponseSectorDto } from '../dto/response-sector.dto';
import { ScaleDto } from '../dto/scale.dto';
import { SectorDto } from '../dto/sector.dto';

export const chooseCooperators = ({
  cooperators = [],
  alreadyChoosedCooperators = [],
  scale,
  sector,
  memoryScale,
  memorySector,
}: {
  cooperators: CreateCooperatorsScaleDto[];
  alreadyChoosedCooperators: AlreadySelectedCooperatorsDto[];
  scale: ScaleDto;
  sector: SectorDto;
  memoryScale: ResponseScaleDto[];
  memorySector: ResponseSectorDto[];
}): CreateCooperatorsScaleDto[] => {
  const dayOfWeek = getDay(scale.date);

  // escalar pontualmente quem foi escolhido pra ser escalado nesse determinado setor e escala ()
  const selectedCooperators = [];

  const choosedCooperatorsSameSector = alreadyChoosedCooperators.find(
    (
      choosed, // ver nome de variável dps
    ) => choosed.sectors.some((sec) => sec.id_sector === sector.id_sector),
  );

  if (choosedCooperatorsSameSector) {
    const alreadyChoosedCoopsId = choosedCooperatorsSameSector.sectors.find(
      (sec) => sec.id_sector === sector.id_sector,
    ).id_coops;

    selectedCooperators.push(alreadyChoosedCoopsId);
  }

  if (selectedCooperators.length === sector.limit) return selectedCooperators; // se ja tem a quantidade, retorna

  const oldScalesSameDay = memoryScale.filter(
    (scale) => scale.period && getDay(scale.date) === dayOfWeek,
  );

  const sectorOldScaleSameDay = oldScalesSameDay[
    oldScalesSameDay.length - 1
  ].sectors.find((sec) => sec.id_sector === sector.id_sector);

  // agora é pegar o type (dentro ou fora)

  // evitar caso:wtipo de setor e com a mesma data + período da escala
  // ele já tenha sido escalado na última escala

  // em ultimo caso ou se atingir uma determinada prioridade
  // se faltar cooperador, pode escalar diácuno

  return cooperators;
};
