import { CreateCooperatorsScaleDto } from '../dto/create-cooperators.scale.dto';
import { ResponseScaleDto } from '../dto/response-scale.dto';
import { ResponseSectorDto } from '../dto/response-sector.dto';
import { SectorDto } from '../dto/sector.dto';

export const chooseCooperators = ({
  cooperators = [],
  sector,
  memoryScale,
}: {
  cooperators: CreateCooperatorsScaleDto[];
  sector: SectorDto;
  memoryScale: ResponseScaleDto[];
  memorySector: ResponseSectorDto[];
  index: number;
}): CreateCooperatorsScaleDto[] => {
  const selectedCooperators: CreateCooperatorsScaleDto[] = [];
  const availableCooperators: CreateCooperatorsScaleDto[] = [...cooperators];

  // Nova lógica: Contar quantas vezes cada cooperador esteve no mesmo tipo de setor (in/out)
  // em todo o histórico de escalas
  const cooperatorTypeCount = new Map<string, { in: number; out: number }>();

  // Inicializar contagem para todos os cooperadores disponíveis
  availableCooperators.forEach((coop) => {
    cooperatorTypeCount.set(coop.id_coop, { in: 0, out: 0 });
  });

  // Contar ocorrências em todo o histórico
  memoryScale.forEach((scale) => {
    scale.sectors.forEach((sec) => {
      sec.cooperators.forEach((coopId) => {
        if (cooperatorTypeCount.has(coopId)) {
          const counts = cooperatorTypeCount.get(coopId);
          if (sec.type === 'in') {
            counts.in++;
          } else {
            counts.out++;
          }
          cooperatorTypeCount.set(coopId, counts);
        }
      });
    });
  });

  // Calcular prioridade com base no desbalanço e história recente
  const cooperatorsWithPriority = availableCooperators.map((coop) => {
    const counts = cooperatorTypeCount.get(coop.id_coop);
    let priority = 0;

    // Fator de balanceamento: Priorizar cooperadores que estiveram menos no tipo atual de setor
    const balanceFactor =
      sector.type === 'in' ? counts.out - counts.in : counts.in - counts.out;
    priority += balanceFactor * 5; // Peso maior para balanceamento

    // Ainda considerar últimas escalas para evitar repetições consecutivas
    const lastThreeScales = memoryScale.slice(-3);
    lastThreeScales.forEach((pastScale, index) => {
      pastScale.sectors.forEach((sec) => {
        if (
          sec.type !== sector.type &&
          sec.cooperators.includes(coop.id_coop)
        ) {
          priority += 30 - index * 10; // 30, 20, 10 para as três últimas escalas
        }
      });
    });

    // Penalização para repetições consecutivas no mesmo tipo
    let consecutiveCount = 0;
    for (let i = memoryScale.length - 1; i >= 0; i--) {
      let found = false;
      memoryScale[i].sectors.forEach((sec) => {
        if (
          sec.type === sector.type &&
          sec.cooperators.includes(coop.id_coop)
        ) {
          found = true;
        }
      });

      if (found) {
        consecutiveCount++;
      } else {
        break;
      }
    }

    // Penalização mais forte para cada repetição consecutiva
    priority -= consecutiveCount * consecutiveCount * 10;

    return { priority, data: coop };
  });

  // Ordenar por prioridade (com tratamento aleatório para empates)
  const orderedPriorityCooperators = cooperatorsWithPriority.sort((a, b) => {
    if (a.priority === b.priority) {
      return Math.random() - 0.5; // Empates resolvidos aleatoriamente
    }
    return b.priority - a.priority;
  });

  // Selecionar cooperadores necessários
  const quantityNecessary = sector.quantity - selectedCooperators.length;
  selectedCooperators.push(
    ...orderedPriorityCooperators
      .slice(0, quantityNecessary)
      .map((coop) => coop.data),
  );

  // Verificação final
  if (selectedCooperators.length === sector.quantity)
    return selectedCooperators;

  // Fallback: usar seleção aleatória se ainda não tiver cooperadores suficientes
  return [
    ...selectedCooperators,
    ...availableCooperators
      .filter((coop) => !selectedCooperators.includes(coop))
      .sort(() => Math.random() - 0.5)
      .slice(0, sector.quantity - selectedCooperators.length),
  ];
};
