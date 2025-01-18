export function filterCooperatorsToScale(cooperators, scale, memoryScale) {
  const sectorCannotDiacun = [3, 4];

  return cooperators.filter((cooperator) => {
    // Verify if has someone pinned exception on actual scale
    const hasPinnedException = cooperator.pinned_exceptions?.some(
      (exception) =>
        exception.sector === scale.sector || exception.period === scale.period,
    );

    // Verify if is diacun and the sector of scale is on sectors where cannot diacuns
    const hasDiacunSectorException =
      cooperator.type === 'diacun' && sectorCannotDiacun.includes(scale.sector);

    // Verify if the cooperator is in penult or last scale
    const hasFrequencyException =
      memoryScale.lastCreatedScale?.cooperators.includes(cooperator.id_coop) ||
      memoryScale.penultCreatedScale?.cooperators.includes(cooperator.id_coop);

    // Verify if has someone exception on actual scale
    const hasException = cooperator.exceptions?.some(
      (exception) =>
        new Date(exception.date).getTime() === scale.date.getTime() &&
        exception.period === scale.period,
    );

    return (
      cooperator.type === 'cooperator' &&
      !hasPinnedException &&
      !hasException &&
      !hasFrequencyException &&
      !hasDiacunSectorException
    );
  });
}
