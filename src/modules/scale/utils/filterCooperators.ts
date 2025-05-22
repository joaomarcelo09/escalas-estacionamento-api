import { CreateCooperatorsScaleDto } from '../dto/create-cooperators.scale.dto';
import { ResponseSectorDto } from '../dto/response-sector.dto';
import { ScaleDto } from '../dto/scale.dto';

export function filterCooperators({
  cooperators,
  scale,
  sectorId,
  scaleId,
  memorySector,
}: {
  cooperators: CreateCooperatorsScaleDto[];
  scale: ScaleDto;
  sectorId: number;
  scaleId: string;
  memorySector: ResponseSectorDto[];
}) {
  const filteredCooperatorsByException = cooperators.filter((cooperator) => {
    // Verify if cooperator its already scaled on another sector

    const sectorsOfThisScale = memorySector.filter(
      (sec) => sec.id_scale === scaleId,
    );
    if (sectorsOfThisScale.length) {
      const hasAlreadySelectedException = sectorsOfThisScale.some((sector) =>
        sector.cooperators.some((coop) => coop.id_coop == cooperator.id_coop),
      );
      if (hasAlreadySelectedException) return false;
    }

    // Verify if has someone pinned exception on actual scale
    const hasPinnedException = cooperator.pinned_exceptions?.some(
      (exception) => exception.id_sector === sectorId,
    );
    if (hasPinnedException) return false;

    const hasAssignments =
      cooperator.assignments.length > 0 &&
      cooperator.assignments.some(
        (assign) => new Date(assign.date).getTime() === scale.date.getTime(),
      );

    if (hasAssignments) return false;

    // Verify if has someone exception on actual scale
    const hasException: boolean = cooperator.exceptions?.some(
      (exception) =>
        new Date(exception.date).getTime() === scale.date.getTime() && // testar depois
        exception.period === scale.period,
    );
    return !hasException;
  });

  return filteredCooperatorsByException;
}
