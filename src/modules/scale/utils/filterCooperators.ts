import { CreateCooperatorsScaleDto } from '../dto/create-cooperators.scale.dto';
import { ResponseScaleDto } from '../dto/response-scale.dto';
import { ScaleDto } from '../dto/scale.dto';

export function filterCooperators({
  cooperators,
  scale,
  sectorId,
  memorySector,
}: {
  cooperators: CreateCooperatorsScaleDto[];
  scale: ScaleDto;
  sectorId: number;
  memoryScale: ResponseScaleDto[];
  memorySector: any;
}) {
  // tipar posteriormente
  // Filter all cooperator by exception if have

  const filteredCooperatorsByException = cooperators.filter((cooperator) => {
    // Verify if cooperator its already scaled on another sector
    const hasAlreadySelectedException = memorySector.some((sector) =>
      sector.cooperators.includes(cooperator.id_coop),
    );
    if (hasAlreadySelectedException) return false;

    // Verify if has someone pinned exception on actual scale
    const hasPinnedException = cooperator.pinned_exceptions?.some(
      (exception) =>
        exception.sector === sectorId || exception.period === scale.period,
    );
    if (hasPinnedException) return false;

    // Verify if has someone exception on actual scale
    const hasException: boolean = cooperator.exceptions?.some(
      (exception) =>
        new Date(exception.date) === scale.date && // testar depois
        exception.period === scale.period,
    );
    return !hasException;
  });

  return filteredCooperatorsByException;
}
