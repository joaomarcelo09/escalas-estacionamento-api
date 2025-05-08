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

  const cooperatorTypeCount = new Map<string, { in: number; out: number }>();
  const cooperatorTotalCount = new Map<string, number>();

  // Initialize counters
  availableCooperators.forEach((coop) => {
    cooperatorTypeCount.set(coop.id_coop, { in: 0, out: 0 });
    cooperatorTotalCount.set(coop.id_coop, 0);
  });

  // Count historical participation
  memoryScale.forEach((scale) => {
    scale.sectors.forEach((sec) => {
      sec.cooperators.forEach((coopId) => {
        if (cooperatorTypeCount.has(coopId)) {
          const counts = cooperatorTypeCount.get(coopId)!;
          if (sec.type === 'in') {
            counts.in++;
          } else {
            counts.out++;
          }
          cooperatorTypeCount.set(coopId, counts);
        }

        if (cooperatorTotalCount.has(coopId)) {
          cooperatorTotalCount.set(
            coopId,
            cooperatorTotalCount.get(coopId)! + 1,
          );
        }
      });
    });
  });

  const cooperatorsWithPriority = availableCooperators.map((coop) => {
    const counts = cooperatorTypeCount.get(coop.id_coop)!;
    const totalCount = cooperatorTotalCount.get(coop.id_coop)!;
    let priority = 0;

    // Balance sector type (in/out)
    const balanceFactor =
      sector.type === 'in' ? counts.out - counts.in : counts.in - counts.out;
    priority += balanceFactor * 5;

    // Factor in recent participation in opposite sector
    const lastThreeScales = memoryScale.slice(-3);
    lastThreeScales.forEach((pastScale, idx) => {
      pastScale.sectors.forEach((sec) => {
        if (
          sec.type !== sector.type &&
          sec.cooperators.includes(coop.id_coop)
        ) {
          priority += 30 - idx * 10; // 30, 20, 10
        }
      });
    });

    // Penalize repeated participation in the same sector type
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
    priority -= consecutiveCount * consecutiveCount * 10;

    // 👇 NEW: Penalize based on total number of times this cooperator has been assigned
    priority -= totalCount * 2; // Adjust weight as needed

    return { priority, data: coop };
  });

  // Sort by priority (with a dash of chaos for ties)
  const orderedPriorityCooperators = cooperatorsWithPriority.sort((a, b) => {
    if (a.priority === b.priority) {
      return Math.random() - 0.5;
    }
    return b.priority - a.priority;
  });

  // Pick the lucky few
  const quantityNecessary = sector.quantity - selectedCooperators.length;
  selectedCooperators.push(
    ...orderedPriorityCooperators
      .slice(0, quantityNecessary)
      .map((coop) => coop.data),
  );

  // Fallback if somehow we still don’t have enough people
  if (selectedCooperators.length < sector.quantity) {
    selectedCooperators.push(
      ...availableCooperators
        .filter((coop) => !selectedCooperators.includes(coop))
        .sort(() => Math.random() - 0.5)
        .slice(0, sector.quantity - selectedCooperators.length),
    );
  }

  return selectedCooperators;
};
