export function filterCooperators(
  cooperators,
  scale,
  sector,
  memoryScale,
  memorySector,
  limit,
) {
  const sectorCannotDiacun = [3, 4];

  // Filter all cooperator by exception if have
  const filterCooperatorByException: any[] = cooperators.filter(
    (cooperator) => {
      // Verify if has someone pinned exception on actual scale
      const hasPinnedException = cooperator.pinned_exceptions?.some(
        (exception) =>
          exception.sector === sector || exception.period === scale.period,
      );

      // Verify if has someone exception on actual scale
      const hasException: boolean = cooperator.exceptions?.some(
        (exception) =>
          new Date(exception.date).getTime() === scale.date.getTime() &&
          exception.period === scale.period,
      );

      // Verify if is diacun and the sector of scale is on sectors where cannot diacuns
      const hasDiacunSectorException =
        cooperator.type === 'diacun' && sectorCannotDiacun.includes(sector);

      return (
        cooperator.type === 'cooperator' &&
        !hasPinnedException &&
        !hasException &&
        !hasDiacunSectorException
      );
    },
  );

  // After filter by exception, filter by frequency in memory scale
  const filterCooperatorByFrequency = filterCooperatorByException.filter(
    (cooperator) => {
      const hasSameSectorException = memorySector.some(
        (x) =>
          x.id_sector !== sector && x.cooperators.includes(cooperator.id_coop),
      );

      const hasFrequencyException = [1, 2].some((offset) => {
        const scale = memoryScale[memoryScale.length - offset];
        return scale?.sectors.some((sec) =>
          sec.cooperators.includes(cooperator.id_coop),
        );
      });

      return (
        cooperator.type === 'cooperator' &&
        !hasSameSectorException &&
        !hasFrequencyException
      );
    },
  );

  return filterCooperatorByFrequency.map((c) => c.id_coop).slice(limit);
}
