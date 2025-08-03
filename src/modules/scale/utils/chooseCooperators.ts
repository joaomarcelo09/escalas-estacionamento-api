import { CreateCooperatorsScaleDto } from '../dto/create-cooperators.scale.dto';
import { ResponseScaleDto } from '../dto/response-scale.dto';
import { ResponseSectorDto } from '../dto/response-sector.dto';
import { SectorDto } from '../dto/sector.dto';

export const chooseCooperators = ({
  cooperators = [],
  sector,
  memoryScale,
  memorySector,
  scaleId,
}: {
  cooperators: CreateCooperatorsScaleDto[];
  sector: SectorDto;
  memoryScale: ResponseScaleDto[];
  memorySector: ResponseSectorDto[];
  scaleId: string;
}): CreateCooperatorsScaleDto[] => {
  const selectedCooperators: CreateCooperatorsScaleDto[] = [];
  const availableCooperators: CreateCooperatorsScaleDto[] = [...cooperators];

  const cooperatorTypeCount = new Map<string, { in: number; out: number }>();
  const cooperatorTotalCount = new Map<string, number>();
  let countDiacun = 1;

  const sectorsOfThisScale = memorySector.filter(
    (sec) => sec.id_scale === scaleId,
  );

  // Initialize counters
  availableCooperators.forEach((coop) => {
    cooperatorTypeCount.set(coop.id_coop, { in: 0, out: 0 });
    cooperatorTotalCount.set(coop.id_coop, 0);

    if (sectorsOfThisScale.length) {
      const hasDiacunIsThisScale = sectorsOfThisScale.some((sector) =>
        sector.cooperators.some((cooperator) =>
          cooperator.name.includes('Dc.'),
        ),
      );

      if (hasDiacunIsThisScale) countDiacun++;
    }
  });

  // Count historical participation
  memoryScale.forEach((scale) => {
    scale.sectors.forEach((sec) => {
      sec.cooperators.forEach((coopId) => {
        if (cooperatorTypeCount.has(coopId.id_coop)) {
          const counts = cooperatorTypeCount.get(coopId.id_coop)!;
          if (sec.type === 'IN') {
            counts.in++;
          } else {
            counts.out++;
          }
          cooperatorTypeCount.set(coopId, counts);
        }

        if (coopId.name.includes('Dc.')) countDiacun++;

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
    let priority = coop.type === 'COOPERATOR' ? 0 : 500 * countDiacun;

    // Balance sector type (in/out)
    const balanceFactor =
      sector.type === 'IN' ? counts.in - counts.out : counts.out - counts.in;
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

    for (let i = memoryScale.length - 1; i >= 0; i--) {
      const hasCoop = memoryScale[i].sectors.some((sec) =>
        sec.cooperators.some((c) => c.id_coop === coop.id_coop),
      );
      if (hasCoop) {
        priority += 300;
      }
    }

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
    priority += consecutiveCount * consecutiveCount * 10;

    // 👇 NEW: Penalize based on total number of times this cooperator has been assigned
    priority += totalCount * 2; // Adjust weight as needed

    return { priority, data: coop };
  });

  // Sort by priority (with a dash of chaos for ties)
  const orderedPriorityCooperators = cooperatorsWithPriority
    .map((item) => ({ ...item, _rand: Math.random() })) // sprinkle in randomness for tie-breakers
    .sort((a, b) => {
      if (a.priority === b.priority) {
        return a._rand - b._rand; // use pre-baked chaos
      }
      return a.priority - b.priority;
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ _rand, ...rest }) => rest); // clean up the temporary field

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
